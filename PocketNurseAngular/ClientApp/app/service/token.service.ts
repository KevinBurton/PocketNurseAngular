import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenService {
    patientUrl = "/api/Token/Patient";
    medicationOrderUrl = "/api/Token/MedicationOrder";
    itemAddUrl = "/api/Token/Item";
    constructor(private http:Http) {}

    addPatients(data: string[]): Observable<string[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var tokens = JSON.stringify(data);
        return this.http.post(this.patientUrl, tokens, options)
                   .map(this.extractData)
                   .catch(this.handleErrorObservable);
    }
    addMedicationOrders(data: string[]): Observable<string[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var tokens = JSON.stringify(data);
        return this.http.post(this.medicationOrderUrl, tokens, options)
                   .map(this.extractData)
                   .catch(this.handleErrorObservable);
    }
    addItems(data: string[]): Observable<string[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var tokens = JSON.stringify(data);
        return this.http.post(this.itemAddUrl, tokens, options)
                   .map(this.extractData)
                   .catch(this.handleErrorObservable);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
}