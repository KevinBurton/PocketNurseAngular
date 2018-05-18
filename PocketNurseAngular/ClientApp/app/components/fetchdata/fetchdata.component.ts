
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import * as fileType from 'file-type';
import { MaxLengthValidator } from '@angular/forms';
import { CabinetSession } from '../../shared/session';
import { TokenService } from '../../service/token.service';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html',
    styleUrls: [ './fetchdata.component.css' ]
})
export class FetchDataComponent {
    name: String | undefined | null;
    workbook: XLSX.WorkBook | undefined | null;
    fileTypes: string[] = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    constructor(private tokenService: TokenService) {
        this.name = null;
        this.workbook = null;
    }

    updateImageDisplay(input: HTMLInputElement, preview: HTMLDivElement): void {
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }

        console.log(input.value);

        var curFiles = input.files;

        if (curFiles === null || curFiles.length === 0) {
            var para = document.createElement('p');
            para.textContent = 'No files currently selected for upload';
            preview.appendChild(para);
        } else {
            this.name = curFiles[0].name;
            var list = document.createElement('ul');
            preview.appendChild(list);

            var fileReader: FileReader = new FileReader();
            fileReader.onloadend = (e) => {
                if(e && e.target) {
                    var content = (e.target as FileReader).result;    
                    var binary = "";
                    var bytes = new Uint8Array(content);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                      binary += String.fromCharCode(bytes[i]);
                    }

                    // call 'xlsx' to read the file
                    this.workbook = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:true});
                    var listItem = document.createElement('li');
                    var mimeType = fileType(bytes).mime;
                    if (this.validFileType(mimeType)) {
                        listItem.textContent = 'File name ' + this.name + ', file size ' + this.returnFileSize(content.byteLength) + '.';
                    } else {
                        listItem.textContent = 'File name ' + this.name + ': Not a valid file type (' + mimeType + '). Update your selection.';
                    }
    
                    list.appendChild(listItem);
                    var excelList = document.createElement('ul');
                    list.appendChild(excelList);
                    if(this.workbook) {
                        for(let sheetName of this.workbook.SheetNames) {
                            var excelListItem = document.createElement('li');
                            var range = XLSX.utils.decode_range(this.workbook.Sheets[sheetName]['!ref'] as string);
                            excelListItem.textContent = sheetName + ', (' + range.e.r + ',' + range.e.c + ')';
                            excelList.appendChild(excelListItem);
                        }
                    }
                }
            }
            fileReader.readAsArrayBuffer(curFiles[0]);
        }
    };
    private sheetArray (sheet: XLSX.WorkSheet): any[][] {
        var result = [];
        var row;
        var rowNum;
        var colNum;
        var range = XLSX.utils.decode_range(sheet['!ref'] as string);
        for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
           row = [];
            for(colNum=range.s.c; colNum<=range.e.c; colNum++){
               var nextCell = sheet[
                  XLSX.utils.encode_cell({r: rowNum, c: colNum})
               ];
               if( typeof nextCell === 'undefined' ){
                row.push(void 0);
               } else {
                row.push(nextCell.w);
               }
            }
            result.push(row);
        }
        return result;
    };
    uploadTokens(): void {
        var session = new CabinetSession();
        var sessionRe = new RegExp('Session',  'i');
        var patientRe = new RegExp('Patient Information', 'i');
        var medOrderRe = new RegExp('Med Order Information', 'i');
        var formularyRe = new RegExp('Items not in PN formulary', 'i');
        var dobRe = /(\d+)\/(\d+)\/.*/;
        var patientTokens = [];
        var medOrderTokens = [];
        var notInFormularyTokens = [];
        if(this.workbook) {
            for(let sheetName of this.workbook.SheetNames) {
                var excelListItem = document.createElement('li');
                var sheetArray = this.sheetArray(this.workbook.Sheets[sheetName]);
                if(sessionRe.test(sheetName)) {
                    session.from = sheetArray[1][0];
                    session.to = sheetArray[1][1];
                    session.siteId = sheetArray[1][2];
                    session.omniId = sheetArray[1][3];
                } else if(patientRe.test(sheetName)) {
                    for(var i = 1; i < sheetArray.length; i++) {
                        var dobString = sheetArray[i][2];
                        var match = dobRe.exec(dobString as string);
                        var stringToken = `${String("          " + session.from).slice(-10)}${String("          " + session.to).slice(-10)}${"              PA"}\\site:${session.siteId}\\pid:${sheetArray[i][4] ? sheetArray[i][4] : sheetArray[i][3]}\\pna:${sheetArray[i][0] + " " + sheetArray[i][1]}\\dob:0000${match ? String("00" + match[1]).slice(-2) : "00"}${match ? String("00" + match[2]).slice(-2) : "00"}00000000\\alrgy:${sheetArray[i][5]}\\mrn:${sheetArray[i][3]}`;
                        patientTokens.push(stringToken);
                    }
                } else if(medOrderRe.test(sheetName)) {
                    for(var i = 1; i < sheetArray.length; i++) {
                        for( var j = 5; j < sheetArray[i].length; j++) {
                            if(typeof sheetArray[i][j] === 'undefined') break;
                            var stringToken = `${String("          " + session.from).slice(-10)}${String("          " + session.to).slice(-10)}${"             MOA"}\\moid:0\\pid:${sheetArray[i][j]}\\item:${sheetArray[i][0]}\\phyid:0\\phynm:Doctor\\frq:${sheetArray[i][3]}\\mrte:${sheetArray[i][4]}\\dose:${sheetArray[i][2]}`;                                        
                            medOrderTokens.push(stringToken);
                        }
                    }
                } else if(formularyRe.test(sheetName)) {
                    for(var i = 1; i < sheetArray[0].length; i++) {
                        if(typeof sheetArray[i][0] === 'undefined' ||
                           typeof sheetArray[i][1] === 'undefined') continue;
                        var stringToken = `\\osi:${session.omniId}\\item:${sheetArray[i][0]}\\ina:${sheetArray[i][1]}\\dssa:${sheetArray[i][2]}\\dssu:${sheetArray[i][3]}\\dsva:${sheetArray[i][6]}\\dsa:${sheetArray[i][4]}\\dsu:${sheetArray[i][5]}\\dsf:${sheetArray[i][7]}`;                                     
                        notInFormularyTokens.push(stringToken);                                }
                }
            }
        }
    }     
    private validFileType(fileType: String): Boolean {
        for (var i = 0; i < this.fileTypes.length; i++) {
            if (fileType === this.fileTypes[i]) {
                return true;
            }
        }
        return false;
    }
    private returnFileSize(number: number): String {
        if (number < 1024) {
            return number + 'bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + 'KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + 'MB';
        } else {
            return '';
        }
    }
}
