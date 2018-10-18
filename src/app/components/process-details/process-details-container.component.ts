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

import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { AppsProcessService } from '@alfresco/adf-core';
import {
    ProcessFilterService,
    ProcessInstance,
    ProcessService,
    FilterProcessRepresentationModel } from '@alfresco/adf-process-services';
import { ToolbarIconEvent } from '../layout/toolbar/models/toolbar-icon-event';

import { APWProperties } from '../../models';

@Component({
    selector: 'apw-process-details-container',
    templateUrl: './process-details-container.component.html',
    styleUrls: ['./process-details-container.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProcessDetailsContainerComponent implements OnInit, OnDestroy {

    static DEFAULT_PROCESS_FILTER = 'Running';
    static SIDEBAR_DETAILS_TAB = 0;

    sub: Subscription;
    appId: number;
    processInstanceId: string;
    processInstanceDetails: ProcessInstance;
    showInfoDrawer = false;
    readOnlyForm = false;

    selectedTab: number;

    activeTab = ProcessDetailsContainerComponent.SIDEBAR_DETAILS_TAB;

    appName: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private processService: ProcessService,
        private appService: AppsProcessService,
        private processFilterService: ProcessFilterService
    ) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.appId = +params['appId'];
            this.processInstanceId = params['processInstanceId'];
            this.getAppName(this.getAppId());
            this.loadProcessDetails(this.processInstanceId);
        });
    }

    private getAppId(): number {
        return +this.appId === 0 ? null : this.appId;
    }

    private loadProcessDetails(processInstanceId: string) {
        if (processInstanceId) {
            this.processService.getProcess(processInstanceId).subscribe(
                (res: ProcessInstance) => {
                    this.processInstanceDetails = res;
                }
            );
        }
    }

    refresh() {
        this.loadProcessDetails(this.processInstanceDetails.id);
    }

    getAppName(appId: number) {
        if (this.appId === 0) {
            this.appName = APWProperties.TASK_APP_NAME;
        } else {
            this.appService.getApplicationDetailsById(appId).subscribe(
                (res) => {
                    this.appName = res.name;
                }
            );
        }
    }

    hasProcessInstance(): boolean {
        return this.processInstanceDetails && !!this.processInstanceDetails.id;
    }

    isCompletedProcess(): boolean {
        return !!this.processInstanceDetails.ended;
    }

    isRunning(): boolean {
        return !this.isCompletedProcess();
    }

    onSelectedTab(tabIndex: number) {
        this.activeTab = tabIndex;
        this.selectedTab = tabIndex;
    }

    isDetailsTabActive() {
        return this.activeTab === ProcessDetailsContainerComponent.SIDEBAR_DETAILS_TAB;
    }

    onProcessNavigate(taskId) {
        this.router.navigate([`/taskdetails/${this.appId}/${taskId}`]);
    }

    getToolBarActionName(): string {
        return this.showInfoDrawer ? 'info' : '';
    }

    onToolbarIconClick(iconType: ToolbarIconEvent): void {
        if (iconType.isBackType()) {
            this.navigateByHistory();
        } else
        if (iconType.isCloseType()) {
            this.navigateToProcessList();
        } else
        if (iconType.isCancelType()) {
            this.processService.cancelProcess(this.processInstanceId).subscribe(
                () => {
                    this.navigateToProcessList();
                });
        } else
        if (iconType.isInfoType()) {
            this.showInfoDrawer = !this.showInfoDrawer;
        }
    }

    onCancelForm() {
        this.navigateByHistory();
    }

    private navigateByHistory(): void {
        this.location.back();
    }

    onNavigate(event) {
        this.navigateToProcessList();
    }

    navigateToProcessList(): void {
        this.processFilterService.getProcessFilterByName(ProcessDetailsContainerComponent.DEFAULT_PROCESS_FILTER, +this.appId).subscribe(
            (res: FilterProcessRepresentationModel) => {
                const filter = res;
                const navUrl: string = '/apps/' + this.appId + '/processes/' + filter.id;
                this.router.navigateByUrl(navUrl);
            }
        );
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
