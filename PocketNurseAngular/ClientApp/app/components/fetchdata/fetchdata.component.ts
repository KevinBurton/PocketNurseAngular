import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as XLSX from 'xlsx';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html',
    styleUrls: [ './fetchdata.component.css' ]
})
export class FetchDataComponent implements OnInit {

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
            for (var i = 0; i < curFiles.length; i++) {
                var listItem = document.createElement('li');
                if (this.validFileType(curFiles[i])) {
                    listItem.textContent = 'File name ' + curFiles[i].name + ', file size ' + this.returnFileSize(curFiles[i].size) + '.';
                } else {
                    listItem.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type (' + curFiles[i].type + '). Update your selection.';
                }

                list.appendChild(listItem);
            }
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
