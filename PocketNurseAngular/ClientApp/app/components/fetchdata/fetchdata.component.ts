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
    content: ArrayBuffer
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
                    for(let sheetName of oFile.SheetNames) {
                        var range = XLSX.utils.decode_range(oFile.Sheets[sheetName]['!ref'] as string);
                        console.log(sheetName);
                        console.log(range.e);        
                    }
                }
            }
            fileReader.readAsArrayBuffer(curFiles[0]);

                var listItem = document.createElement('li');
                if (this.validFileType(curFiles[0])) {
                    listItem.textContent = 'File name ' + curFiles[0].name + ', file size ' + this.returnFileSize(curFiles[0].size) + '.';
                } else {
                    listItem.textContent = 'File name ' + curFiles[0].name + ': Not a valid file type (' + curFiles[0].type + '). Update your selection.';
                }

                list.appendChild(listItem);

        }
    };
    validFileType(file: File) {
        for (var i = 0; i < this.fileTypes.length; i++) {
            if (file.type === this.fileTypes[i]) {
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
