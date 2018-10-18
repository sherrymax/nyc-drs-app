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

import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { LogService } from '@alfresco/adf-core';
import { MediaQueryService } from '../../../services/media-query.service';

@Component({
    selector: 'apw-task-toolbar',
    templateUrl: './task-toolbar.component.html',
    styleUrls: ['./task-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskToolbarComponent implements OnInit {

    static ACTION_INFO = 'Info';

    @Input()
    selectedAction: string;

    @Input()
    appName: string;

    @Input()
    id: string;

    @Input()
    name: string;

    @Input()
    fileName: string;

    @Output()
    clicked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onBackClick: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    onCloseClick: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    infoClick: EventEmitter<void> = new EventEmitter<void>();

    auditDownload = true;

    mobile = false;

    constructor(private logService: LogService,
                private mediaQuery: MediaQueryService) {

    }

    ngOnInit() {
        this.mediaQuery.mobile$.subscribe( (isMobile) => {
            this.mobile = isMobile;
        });
    }

    onBackButtonClick(): void {
        this.onBackClick.emit();
    }

    onCloseIconClick(): void {
        this.onCloseClick.emit();
    }

    onInfoClick(): void {
        if (this.isInfoActionSelected()) {
            this.selectedAction = '';
        } else {
            this.selectedAction = TaskToolbarComponent.ACTION_INFO;
        }
        this.infoClick.emit();
    }

    onAuditError(event: any): void {
        this.logService.error(event);
    }

    onAuditClick(event: any): void {
        this.clicked.emit(event);
    }

    isInfoActionSelected(): boolean {
        return this.selectedAction.toLocaleUpperCase() === TaskToolbarComponent.ACTION_INFO.toLocaleUpperCase() ? true : false;
    }

    displayAppName(): string {
        return ' in ' + this.appName;
    }
}
