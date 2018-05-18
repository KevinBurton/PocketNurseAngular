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

    addPatients(data: string[]): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.patientUrl, data, options)
                        .catch(this.handleErrorObservable);
    }
    addMedicationOrders(data: string[]): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.medicationOrderUrl, data, options)
                        .catch(this.handleErrorObservable);
    }
    addItems(data: string[]): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.itemAddUrl, data, options)
                        .catch(this.handleErrorObservable);
    }
    private handleErrorObservable (error: Response | any) {
        return Observable.throw(error.message || error);
    }
}