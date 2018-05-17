import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as XLSX from 'xlsx';
import * as fileType from 'file-type';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html',
    styleUrls: [ './fetchdata.component.css' ]
})
export class FetchDataComponent implements OnInit {
    content: ArrayBuffer;
    name: String;
    fileTypes: string[] = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    constructor() {

    }
    ngOnInit(){
    }

    updateImageDisplay(input: HTMLInputElement, preview: HTMLDivElement) {
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
                    this.content = (e.target as FileReader).result;    
                    var binary = "";
                    var bytes = new Uint8Array(this.content);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                      binary += String.fromCharCode(bytes[i]);
                    }
                    console.log(fileType(bytes));
                    // call 'xlsx' to read the file
                    var oFile = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:true});
                    var listItem = document.createElement('li');
                    var mimeType = fileType(bytes).mime;
                    if (this.validFileType(mimeType)) {
                        listItem.textContent = 'File name ' + this.name + ', file size ' + this.returnFileSize(this.content.byteLength) + '.';
                    } else {
                        listItem.textContent = 'File name ' + this.name + ': Not a valid file type (' + mimeType + '). Update your selection.';
                    }
    
                    list.appendChild(listItem);
                    var excelList = document.createElement('ul');
                    list.appendChild(excelList);
                    if(oFile) {
                        for(let sheetName of oFile.SheetNames) {
                            var range = XLSX.utils.decode_range(oFile.Sheets[sheetName]['!ref'] as string);
                            var excelListItem = document.createElement('li');
                            excelListItem.textContent = sheetName + ', (' + range.e.r + ',' + range.e.c + ')';
                            excelList.appendChild(excelListItem);
                        }
                    }
                }
            }
            fileReader.readAsArrayBuffer(curFiles[0]);
        }
    };
    validFileType(fileType: String) {
        for (var i = 0; i < this.fileTypes.length; i++) {
            if (fileType === this.fileTypes[i]) {
                return true;
            }
        }
        return false;
    };
    returnFileSize(number: number) {
        if (number < 1024) {
            return number + 'bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + 'KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + 'MB';
        }
    };
}
