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

import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, HostBinding, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/timer';
import { AnalyticsService } from '@alfresco/adf-insights/';
import { ObjectDataTableAdapter, ObjectDataRow } from '@alfresco/adf-core';

@Component({
    selector: 'apw-process-statistics',
    templateUrl: './process-statistics.component.html',
    styleUrls: ['./process-statistics.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessStatisticsComponent implements OnInit, OnChanges, OnDestroy {

    private static PROCESS_OVERVIEW_REPORT = 'Process instances overview';

    @Input()
    reportQuery: any;

    private sub: Subscription;

    reportData: ObjectDataTableAdapter;

    showSpinner = false;

    @HostBinding('class.dw-container') true;

    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit() {
        if (this.reportData === undefined) {
            this.reportData = new ObjectDataTableAdapter();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['reportQuery'] && changes['reportQuery'].currentValue) {
            this.reportQuery = changes['reportQuery'].currentValue;
            this.showSpinner = true;
            this.sub = this.getReportData().subscribe(data => {
                this.renderReport(data);
                this.showSpinner = false;
            },
            (err) => {
                this.renderReport();
                this.showSpinner = false;
            });
        }
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    private renderReport(data?: any): void {
        let rows = [];
        if (data && data.datasets) {
            rows = data.datasets.map(obj => {
                return new ObjectDataRow(obj);
            });
        }
        this.reportData.setRows(rows);
    }

    private getReportData(): Observable<any> {
        return this.analyticsService.getReportByName(ProcessStatisticsComponent.PROCESS_OVERVIEW_REPORT)
            .switchMap(report => {
                if (!report) {
                    return this.createDefaultReports();
                } else {
                   return Observable.forkJoin(
                        this.getDataServices(report.id),
                        (dataActive: any, dataComplete: any) => {
                            const dataAll = Object.assign({}, this.mergeProcessDataSets(dataActive, dataComplete));
                            return dataAll;
                        });
                    }
                }
            );
    }

    private createDefaultReports() {
        return this.analyticsService.createDefaultReports()
        .switchMap(() => this.getReportData());
    }

    private getDataServices(reportId: number): Observable<any>[] {
        const dataServices = new Array(Observable.of({}), Observable.of({}));
        if (!this.isCompleteStatus()) {
            const reportQueryActive = Object.assign({}, this.reportQuery, { status: 'Active' });
            dataServices[0] = this.getReportService(reportId, reportQueryActive);
        }
        if (!this.isActiveStatus()) {
            const reportQueryComplete = Object.assign({}, this.reportQuery, { status: 'Complete' });
            const delay = this.isCompleteStatus() ? 0 : 100;
            dataServices[1] = Observable.timer(delay).switchMap(() => this.getReportService(reportId, reportQueryComplete));
        }
        return dataServices;
    }

    private getReportService(reportId: number, reportQuery: any): Observable<any> {
        return this.analyticsService.getReportsByParams(reportId, reportQuery)
        .map((data: any[]) => data.filter(i => i.type === 'table')[0]);
    }

    private isActiveStatus(): boolean {
        return this.reportQuery && this.reportQuery.status === 'Active';
    }

    private isCompleteStatus(): boolean {
        return this.reportQuery && this.reportQuery.status === 'Complete';
    }

    private mergeProcessDataSets(dataActive: any, dataComplete: any): any {
        let dataSet;
        if (dataActive.datasets && dataActive.datasets.length > 0 &&
            dataComplete.datasets && dataComplete.datasets.length > 0) {
            dataActive.datasets.forEach(element => {
                let index = this.getActivityIndex(dataComplete, element[0]);
                if (index < 0) {
                    dataComplete.datasets.push(element);
                    index = dataComplete.datasets.length - 1;
                    if (dataComplete.datasets[index].length === 7) {
                        dataComplete.datasets[index].unshift(...new Array(7));
                        dataComplete.datasets[index][0] = dataComplete.datasets[index][7];
                    }
                }
                dataComplete.datasets[index].push(...element);
                dataSet = dataComplete;
            });

        } else if (dataActive.datasets && dataActive.datasets.length > 0) {
            dataActive.datasets.forEach(element => {
                element.unshift(...new Array(7));
                element[0] = element[7];
            });
            dataSet = dataActive;
        } else {
            dataSet = dataComplete;
        }
        return dataSet;
    }

    private getActivityIndex(dataSet: any, activity: string): number {
        let index = -1;
        dataSet.datasets.forEach((element, i) => {
            if (element[0] === activity) {
                index = i;
            }
        });
        return index;
    }

    getDashboardClass(): string {
        let cssClass = '';
        if (this.isActiveStatus()) {
            cssClass = 'dw-active-report';
        } else if (this.isCompleteStatus()) {
            cssClass = 'dw-complete-report';
        }
        return cssClass;
    }
}
