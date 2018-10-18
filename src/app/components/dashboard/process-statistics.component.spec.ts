/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AnalyticsService } from '@alfresco/adf-insights/';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ProcessStatisticsComponent } from './process-statistics.component';

describe('ProcessStatisticsComponent', () => {

    let component: ProcessStatisticsComponent;
    let fixture: ComponentFixture<ProcessStatisticsComponent>;
    let analyticsService: AnalyticsService;
    let getReportByNameSpy: jasmine.Spy;
    let getReportsByParamsSpy: jasmine.Spy;

    const reportQuery = [
        {
            dateRange: {
                startDate: '2016-11-03T15:25:42.749+0000',
                endDate: '2017-11-03T15:25:42.749+0000',
                rangeId: 2017
            },
            status: 'Active',
            processDefinitionId: 'processDefId:1029',
            slowProcessInstanceInteger: 10
        },
        {
            dateRange: {
                startDate: '2016-11-03T15:25:42.749+0000',
                endDate: '2017-11-03T15:25:42.749+0000',
                rangeId: 2017
            },
            status: 'Active',
            processDefinitionId: 'processDefId:1029',
            slowProcessInstanceInteger: 10
        }
    ];

    const fakeReportList = [
        {
            id: '1',
            name: 'Fake Report 1'
        },
        {
            id: '2',
            name: 'Fake Report 2'
        }
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProcessStatisticsComponent
            ],
            providers: [ AnalyticsService, AlfrescoApiService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessStatisticsComponent);
        component = fixture.componentInstance;
        analyticsService = TestBed.get(AnalyticsService);
        getReportByNameSpy = spyOn(analyticsService, 'getReportByName').and.returnValue(Observable.of(fakeReportList));
        getReportsByParamsSpy = spyOn(analyticsService, 'getReportsByParams').and.returnValue(Observable.of(fakeReportList));
        component.reportQuery = [
            {
                dateRange: {
                    startDate: '2016-11-03T15:25:42.749+0000',
                    endDate: '2017-11-03T15:25:42.749+0000',
                    rangeId: 2017
                },
                status: 'Active',
                processDefinitionId: 'processDefId:1029',
                slowProcessInstanceInteger: 10
            },
            {
                dateRange: {
                    startDate: '2016-11-03T15:25:42.749+0000',
                    endDate: '2017-11-03T15:25:42.749+0000',
                    rangeId: 2017
                },
                status: 'Active',
                processDefinitionId: 'processDefId:1029',
                slowProcessInstanceInteger: 10
            }
        ];
        fixture.detectChanges();
    });

    it('should create instance of CreateProcessComponent', () => {
        expect(fixture.componentInstance instanceof ProcessStatisticsComponent).toBe(true);
    });

    it('should define adf-datatable ', () => {
        component.reportQuery = reportQuery;
        fixture.detectChanges();
        const adfDatatable = fixture.debugElement.nativeElement.querySelector('adf-datatable');
        expect(adfDatatable).toBeDefined();
    });

    xit('should call service to fetch process definitions without appId', () => {
        component.reportQuery = reportQuery;
        const change = new SimpleChange(null, reportQuery, true);
        component.ngOnChanges({ 'reportQuery': change });
        fixture.detectChanges();
        expect(getReportByNameSpy).toHaveBeenCalled();
    });
});
