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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {

    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DashboardComponent
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                        useValue: {
                            parent: {params: Observable.of({appId: 123})}
                        }
                    }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create instance of DashboardComponent', () => {
        expect(fixture.componentInstance instanceof DashboardComponent).toBe(true);
    });

    it('should define apw-process-statistics', () => {
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
        component.appId = '1002';
        fixture.detectChanges();
        const apwProcessStatistics = fixture.debugElement.nativeElement.querySelector('apw-process-statistics');
        expect(apwProcessStatistics).toBeDefined();
        expect(apwProcessStatistics).not.toBeNull();
    });

    it('should not display apw-process-statistics if the reportQuery is empty', () => {
        component.reportQuery = null;
        component.appId = '1002';
        fixture.detectChanges();
        const apwProcessStatistics = fixture.debugElement.nativeElement.querySelector('apw-process-statistics');
        expect(apwProcessStatistics).toBeNull();
    });

    it('should define apw-dashboard-settings', () => {
        component.appId = '1002';
        fixture.detectChanges();
        const apwDashboardSettings = fixture.debugElement.nativeElement.querySelector('apw-dashboard-settings');
        expect(apwDashboardSettings).toBeDefined();
    });

    it('should define breadcrumb and adfToolbar', () => {
        fixture.detectChanges();
        const adfToolbar = fixture.debugElement.nativeElement.querySelector('adf-toolbar');
        const breadcrumb = fixture.debugElement.nativeElement.querySelector('apw-breadcrumbs');
        const breadcrumbActions = fixture.debugElement.nativeElement.querySelector('apw-breadcrumb-actions');
        expect(adfToolbar).toBeDefined();
        expect(breadcrumb).toBeDefined();
        expect(breadcrumbActions).toBeDefined();
    });
});
