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

import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { MOMENT_DATE_FORMATS, MomentDateAdapter, UserPreferencesService } from '@alfresco/adf-core';
import { AnalyticsService } from '@alfresco/adf-insights';
import { MediaQueryService } from '../../services/media-query.service';

@Component({
    selector: 'apw-dashboard-settings',
    templateUrl: './dashboard-settings.component.html',
    styleUrls: ['./dashboard-settings.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }],
    encapsulation: ViewEncapsulation.None
})
export class DashboardSettingsComponent implements OnInit, OnDestroy {

    @Input()
    appId: number;

    @Output()
    parameterChange = new EventEmitter<any>();

    statusesMobile = [
        { 'desc': 'DASHBOARD-SETTINGS.STATUS.OPTIONS.STATUS-COMPLETE', 'id': 'Complete' },
        { 'desc': 'DASHBOARD-SETTINGS.STATUS.OPTIONS.STATUS-ACTIVE', 'id': 'Active' }
    ];

    statusesDesk = [
        { 'desc': 'DASHBOARD-SETTINGS.STATUS.OPTIONS.STATUS-ALL', 'id': 'All' },
        { 'desc': 'DASHBOARD-SETTINGS.STATUS.OPTIONS.STATUS-COMPLETE', 'id': 'Complete' },
        { 'desc': 'DASHBOARD-SETTINGS.STATUS.OPTIONS.STATUS-ACTIVE', 'id': 'Active' }
    ];


    statuses;

    processDefinitions;
    processDefinitionId: string;
    status: string;
    fromDate: Moment;
    toDate: Moment;

    private processDefinitionSub: Subscription;

    constructor(
        private mediaQuery: MediaQueryService,
        private analyticsService: AnalyticsService,
        private dateAdapter: DateAdapter<Moment>,
        private preferences: UserPreferencesService) { }

    ngOnInit() {
        this.mediaQuery.mobile$.subscribe( (isMobile) => {
            this.statuses = isMobile ? this.statusesMobile : this.statusesDesk;
            this.emitReportParam();
        });
        this.preferences.locale$.subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });

        if (this.getAppId()) {
            this.getProcessDefinitionsForApp(this.getAppId());
        } else {
            this.getProcessDefinitionsForNoApp();
        }
    }

    ngOnDestroy() {
        if (this.processDefinitionSub) {
            this.processDefinitionSub.unsubscribe();
        }
    }

    private setDefaults(): void {
        this.status = this.statuses[0].id;
        this.processDefinitionId = this.processDefinitions[0] ? this.processDefinitions[0].id : '';
        this.toDate = moment();
        this.fromDate = moment().subtract(365, 'days');
        this.emitReportParam();
    }

    public getAppId(): number {
        return +this.appId === 0 ? null : this.appId;
    }

    emitReportParam(): void {
        if (this.fromDate && this.toDate && this.status && this.processDefinitionId) {
            this.fromDate.set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
            this.toDate.set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999});
            const reportQuery = {
                    dateRange: {
                        startDate: this.fromDate.toDate(), endDate: this.toDate.toDate(), rangeId: 'currentYear'
                    },
                    status: this.status,
                    processDefinitionId: this.processDefinitionId,
                    slowProcessInstanceInteger: 10
                };
            this.parameterChange.emit(reportQuery);
        }
    }

    private getProcessDefinitionsForApp(appId: number): void {
        this.processDefinitionSub = this.analyticsService.getProcessDefinitionsValues(appId)
            .subscribe(data => {
                this.processDefinitions = data;
                this.setDefaults();
            });
    }

    private getProcessDefinitionsForNoApp(): void {
        this.processDefinitionSub = this.analyticsService.getProcessDefinitionsValuesNoApp()
            .subscribe(data => {
                this.processDefinitions = data;
                this.setDefaults();
            });
    }
}
