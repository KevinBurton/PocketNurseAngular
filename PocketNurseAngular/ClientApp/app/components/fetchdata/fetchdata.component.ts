import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as XLSX from 'xlsx';
import * as fileType from 'file-type';
import { MaxLengthValidator } from '@angular/forms';
import { CabinetSession } from '../../shared/session';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html',
    styleUrls: [ './fetchdata.component.css' ]
})
export class FetchDataComponent implements OnInit {
    name: String | undefined | null;
    workbook: XLSX.WorkBook | undefined | null;
    fileTypes: string[] = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    constructor() {
        this.name = null;
        this.workbook = null;
    }

    ngOnInit(){
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
                    var session = new CabinetSession();
                    var sessionRe = new RegExp('[Ss]ession.*');
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
                            var sheetArray = this.sheetArray(this.workbook.Sheets[sheetName]);
                            if(sessionRe.test(sheetName)) {
                                session.from = sheetArray[1][0];
                                session.to = sheetArray[1][1];
                                session.siteId = sheetArray[1][2];
                                session.omniId = sheetArray[1][3];
                            }
                            excelListItem.textContent = sheetName + ', (' + sheetArray.length + ',' + sheetArray[0].length + ')';
                            excelList.appendChild(excelListItem);
                        }
                    }
                }
            }
            fileReader.readAsArrayBuffer(curFiles[0]);
        }
    };
    sheetArray (sheet: XLSX.WorkSheet): any[][] {
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
               if( typeof nextCell !== 'undefined' ){
                row.push(nextCell.w);
               }
            }
            result.push(row);
        }
        return result;
     };     
    validFileType(fileType: String): Boolean {
        for (var i = 0; i < this.fileTypes.length; i++) {
            if (fileType === this.fileTypes[i]) {
                return true;
            }
        }
        return false;
    };
    returnFileSize(number: number): String {
        if (number < 1024) {
            return number + 'bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + 'KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + 'MB';
        } else {
            return '';
        }
    };
}
