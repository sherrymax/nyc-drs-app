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

import { Component, ViewEncapsulation, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProcessInstance } from '@alfresco/adf-process-services';
import { LogService } from '@alfresco/adf-core';

@Component({
    selector: 'apw-process-details',
    templateUrl: './process-details.component.html',
    styleUrls: ['./process-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProcessDetailsComponent implements OnInit {

    @Input()
    processInstanceDetails: ProcessInstance;

    @Output()
    navigate: EventEmitter<string> = new EventEmitter<string>();

    presetColoum = 'dw-process-task-list';

    constructor(private logService: LogService) { }

    ngOnInit() {
    }

    onTaskRowDoubleCLick(rowevent: any): void {
        const taskId = rowevent.detail.value.obj.id;
        this.navigate.emit(taskId);
    }

    getTaskStatus(taskDetails: any): string {
        return taskDetails.endDate ? 'Completed' : 'Open';
    }

    getFullName(user: any): string {
        let fullName = '';
        if (user) {
            if (user.firstName) {
                fullName += user.firstName;
            }
            if (user.lastName) {
                fullName += fullName.length > 0 ? ' ' : '';
                fullName += user.lastName;
            }
        }
        return fullName;
    }

    isCompletedProcess(): boolean {
        return !!this.processInstanceDetails.ended;
    }

    isRunning(): boolean {
        return !this.isCompletedProcess();
    }

    onAuditError(event: any): void {
        this.logService.error(event);
    }

    onViewTask(taskId: any): void {
        this.navigate.emit(taskId);
    }
}
