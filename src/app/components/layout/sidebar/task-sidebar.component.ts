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
    Input,
    Output,
    EventEmitter,
    HostBinding,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import { TaskDetailsModel } from '@alfresco/adf-process-services';
import { LightUserRepresentation } from 'alfresco-js-api';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/share';

import {
    ClickNotification,
    LogService,
    UpdateNotification,
    CardViewUpdateService,
    PeopleProcessService
} from '@alfresco/adf-core';

import { TaskListService } from '@alfresco/adf-process-services';
import { Router } from '@angular/router';


@Component({
    selector: 'apw-task-sidebar',
    templateUrl: './task-sidebar.component.html',
    styleUrls: ['./task-sidebar.component.scss'],
    providers: [ CardViewUpdateService ],
    encapsulation: ViewEncapsulation.None
})

export class TaskSidebarComponent implements OnInit, OnChanges, OnDestroy {

    @HostBinding('class.dw-task-sidebar') true;

    @Input()
    appId: number;

    @Input()
    taskDetails: TaskDetailsModel;

    @Input()
    taskFormName: string;

    @Input()
    readOnlyForm = false;

    @Input()
    selectedTab: number;

    @Output()
    changeAssignee: EventEmitter<LightUserRepresentation> = new EventEmitter<LightUserRepresentation>();

    @Output()
    updated: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    currentTab: EventEmitter<number> = new EventEmitter<number>();

    taskPeople: LightUserRepresentation[] = [];

    showInfoDrawer = false;

    showAssignee = false;

    private peopleSearchObserver: Observer<LightUserRepresentation[]>;
    peopleSearch$: Observable<LightUserRepresentation[]>;
    cardViewUpdateSub: Subscription;
    cardViewClickSub: Subscription;

    constructor(
        private taskListService: TaskListService,
        private logService: LogService,
        private router: Router,
        private peopleService: PeopleProcessService,
        private cardViewUpdateService: CardViewUpdateService
    ) { }

    ngOnInit() {
        this.peopleSearch$ = new Observable<LightUserRepresentation[]>(observer => this.peopleSearchObserver = observer).share();
        this.cardViewUpdateSub = this.cardViewUpdateService.itemUpdated$.subscribe(this.updateTaskDetails.bind(this));
        this.cardViewClickSub = this.cardViewUpdateService.itemClicked$.subscribe(this.clickTaskDetails.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.taskDetails && changes.taskDetails.currentValue) {
            this.setInvolvedPeople();
        }
    }

    ngOnDestroy() {
        this.cardViewUpdateSub.unsubscribe();
        this.cardViewClickSub.unsubscribe();
    }

    setInvolvedPeople(): void {
        this.taskPeople = [];
        if (this.taskDetails.involvedPeople) {
            this.taskDetails.involvedPeople.forEach((user) => {
                this.taskPeople.push(<LightUserRepresentation>user);
            });
        }
    }

    hasTaskDetails(): boolean {
        return this.taskDetails && !!this.taskDetails.id;
    }

    onCurrentTab(tabIndex: number) {
        this.currentTab.emit(tabIndex);
    }

    getTaskHeaderViewClass() {
        return this.showAssignee ? 'assign-edit-view' : 'default-view';
    }

    searchUser(searchedWord: string) {
        this.peopleService.getWorkflowUsers(null, searchedWord)
            .subscribe((users) => {
                users = users.filter((user) => user.id !== (this.taskDetails.assignee && this.taskDetails.assignee.id));
                this.peopleSearchObserver.next(users);
            }, error => this.logService.error('Could not load users'));
    }

    assignTaskToUser(selectedUser: LightUserRepresentation) {
        this.changeAssignee.emit(selectedUser);
        this.showAssignee = false;
    }

    onCloseSearch() {
        this.showAssignee = false;
    }

    onClaim(): void {
        this.claim.emit();
    }

    private updateTaskDetails(updateNotification: UpdateNotification) {
        this.taskListService.updateTask(this.taskDetails.id, updateNotification.changed)
            .subscribe(
                () => {
                    this.updated.emit();
                }
            );
    }

    private clickTaskDetails(clickNotification: ClickNotification) {
        if (clickNotification.target.key === 'assignee') {
            this.showAssignee = true;
        } else if (clickNotification.target.value !== undefined) {
            this.onTaskDetailsClick(clickNotification);
        }
    }

    onTaskDetailsClick(clickNotification: ClickNotification) {
        const parentId = clickNotification.target.value.keys().next().value;
        this.router.navigate([`/processdetails/${this.appId}/${parentId}`]);
    }

}
