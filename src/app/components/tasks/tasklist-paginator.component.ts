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

import {
    Component,
    ChangeDetectorRef,
    AfterViewInit,
    OnInit, Input, Output, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Pagination } from 'alfresco-js-api';
import { ObjectDataTableAdapter, DataSorting, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { FilterRepresentationModel, TaskListComponent } from '@alfresco/adf-process-services';
import { ApplicationContentStateService } from '../../services/application-content-state.service';
@Component({
    selector: 'apw-tasklist-paginator',
    templateUrl: './tasklist-paginator.component.html',
    styleUrls: ['./tasklist-paginator.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class TaskListPaginatorComponent implements OnInit, AfterViewInit {

    @ViewChild('taskList')
    taskList: TaskListComponent;

    @Input()
    currentFilter: FilterRepresentationModel;

    @Input()
    selectionMode = 'single'; // none|single|multiple

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    rowClick: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    rowDoubleClick: EventEmitter<any> = new EventEmitter<any>();

    dataTasks: ObjectDataTableAdapter;
    paginationPageSize = 0;
    supportedPageSizes: any[];

    presetColoum = 'dw-task-list';

    constructor(private userPreferenceService: UserPreferencesService,
                private changeDetector: ChangeDetectorRef,
                private applicationContentStateService: ApplicationContentStateService) {

    }

    ngAfterViewInit() {
        this.changeDetector.detectChanges();
    }

    ngOnInit() {
        if ( this.userPreferenceService.get(UserPreferenceValues.PaginationSize)) {
            this.paginationPageSize = +this.userPreferenceService.get(UserPreferenceValues.PaginationSize);
        } else {
            this.userPreferenceService.select(UserPreferenceValues.PaginationSize).subscribe((pageSize) => {
                this.paginationPageSize = pageSize;
            });
        }
        this.userPreferenceService.select(UserPreferenceValues.SupportedPageSizes).subscribe((supportedPageSizes) => {
            this.supportedPageSizes = supportedPageSizes;
        });
        this.setSortOrder();
    }

    private setSortOrder(): void {
        this.dataTasks = new ObjectDataTableAdapter([], []);
        this.dataTasks.setSorting(new DataSorting('created', 'desc'));
    }

    onSuccessTaskList(event: any) {
        this.applicationContentStateService.hasTaskContent = this.hasTaskContent(event);
        const currentTaskId = this.taskList.getCurrentId();
        this.success.emit(currentTaskId);
    }

    onRowClick(event: any) {
        this.rowClick.emit(event);
    }

    onRowDoubleClick(event: any) {
        this.rowDoubleClick.emit(event);
    }

    reloadTask() {
        this.taskList.reload();
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

    onChangePageSize(pagination: Pagination): void {
        this.userPreferenceService.paginationSize = pagination.maxItems;
    }

    private hasTaskContent(event: any): boolean {
        if (event) {
            return event.data.length === 0 ? false : true;
        }
    }
}
