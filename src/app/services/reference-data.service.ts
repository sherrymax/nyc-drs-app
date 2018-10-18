// Imports
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { ReferenceDataModel } from '../models/reference-data.model';
import { Observable } from 'rxjs/Rx';
import { AppConfigService } from '@alfresco/adf-core';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReferenceDataService {
    options: RequestOptions;
    private apiUrlBase;
    private fullURL;

    // Resolve HTTP using the constructor
    constructor(private http: Http, private appConfgiService: AppConfigService) {
        var jsonDBBaseUrl = this.appConfgiService.get<string>('REFERENCE_DATA_BASEURL');
        this.apiUrlBase = jsonDBBaseUrl; //'http://18.236.222.180:4000/';  
    }

    getValues(jsonDBType): Observable<ReferenceDataModel[]> {
        this.fullURL = this.apiUrlBase + jsonDBType;
        return this.http.get(this.fullURL).map(this.extractData);
    }

    getIndexedObject(jsonDBType): Observable<ReferenceDataModel[]> {
        this.fullURL = this.apiUrlBase + jsonDBType;
        return this.http.get(this.fullURL).map(this.extractData);
    }  

    addDataWithPromise(dataToInsert:any): Promise<ReferenceDataModel> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(dataToInsert);

        return this.http.post(this.apiUrlBase, body, options).toPromise()
                .then(this.extractData)
                .catch(this.handleErrorPromise);
    }

    updateDataWithPromise(dataToInsert:any): Promise<ReferenceDataModel> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(dataToInsert);

        return this.http.put(this.fullURL, body, options).toPromise()
                .then(this.extractData)
                .catch(this.handleErrorPromise);
    }

    private extractData(res: Response) {
        let body = res.json();
            return body || {};
    }

    // private handleErrorObservable (error: Response | any) {
    //     console.error(error.message || error);
    //     return Observable.throw(error.message || error);
    // }

    private handleErrorPromise (error: Response | any) {
        console.error(error.message || error);
        return Promise.reject(error.message || error);
    }

}
