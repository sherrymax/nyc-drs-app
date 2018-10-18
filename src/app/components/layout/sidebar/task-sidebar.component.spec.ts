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
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TaskSidebarComponent } from './task-sidebar.component';
import {
    fakeUser2,
    fakeUser3,
    taskDetailsMock,
    taskDetailsWithOutInvolvedPeopleMock,
    taskDetailsWithInvolvedPeopleMock
} from '../../../test-mock';
import { Observable } from 'rxjs/Observable';
import {
    LogService,
    CardViewUpdateService,
    PeopleProcessService,
    CommentProcessService
} from '@alfresco/adf-core';
import { TaskListService } from '@alfresco/adf-process-services';
import { DatePipe } from '@angular/common';

let commentProcessService: CommentProcessService;

describe('TaskSidebarComponent', () => {

    let component: TaskSidebarComponent;
    let fixture: ComponentFixture<TaskSidebarComponent>;
    let taskListService: TaskListService;
    let peopleService: PeopleProcessService;
    let cardViewUpdateService: CardViewUpdateService;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskSidebarComponent
            ],
            providers: [
                TaskListService,
                LogService,
                CardViewUpdateService,
                PeopleProcessService,
                CommentProcessService,
                DatePipe
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskSidebarComponent);
        component = fixture.componentInstance;
        taskListService = fixture.debugElement.injector.get(TaskListService);
        cardViewUpdateService = fixture.debugElement.injector.get(CardViewUpdateService);
        peopleService = fixture.debugElement.injector.get(PeopleProcessService);
        component.taskDetails = taskDetailsMock;
        commentProcessService = fixture.debugElement.injector.get(CommentProcessService);
        spyOn(commentProcessService, 'getTaskComments').and.returnValue(Observable.of([
            {message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}}
        ]));
        fixture.detectChanges();
    });

    it('should create instance of CreateProcessComponent', () => {
        expect(fixture.componentInstance instanceof TaskSidebarComponent).toBe(true);
    });

    it('should define adf-info-drawer', () => {
        fixture.detectChanges();
        const adfUploadDragAarea = fixture.debugElement.nativeElement.querySelector('adf-info-drawer');
        const adfCreateTaskAttachment = fixture.debugElement.nativeElement.querySelector('adf-info-drawer-tab');
        expect(adfUploadDragAarea).toBeDefined();
        expect(adfCreateTaskAttachment).toBeDefined();
    });

    it('should define adf-task-header', () => {
        fixture.detectChanges();
        const adfHeader = fixture.debugElement.nativeElement.querySelector('adf-task-header');
        expect(adfHeader).toBeDefined();
    });

    it('should define adf-people-search', () => {
        fixture.detectChanges();
        const adfPeopleSearch = fixture.debugElement.nativeElement.querySelector('adf-people-search');
        expect(adfPeopleSearch).toBeDefined();
    });

    it('should define adf-people', () => {
        fixture.detectChanges();
        const adfPeople = fixture.debugElement.nativeElement.querySelector('adf-people');
        expect(adfPeople).toBeDefined();
    });

    it('should define adf-comments', () => {
        fixture.detectChanges();
        const adfComments = fixture.debugElement.nativeElement.querySelector('adf-comments');
        expect(adfComments).toBeDefined();
    });

    it('should not define adf people/comments/search/header if th taskDetails is empty ', () => {
        component.taskDetails = null;
        fixture.detectChanges();
        const adfHeader = fixture.debugElement.nativeElement.querySelector('adf-task-header');
        const adfComments = fixture.debugElement.nativeElement.querySelector('adf-comments');
        const adfPeople = fixture.debugElement.nativeElement.querySelector('adf-people');
        const adfPeopleSearch = fixture.debugElement.nativeElement.querySelector('adf-people-search');
        expect(adfPeople).toBeNull();
        expect(adfPeopleSearch).toBeNull();
        expect(adfHeader).toBeNull();
        expect(adfComments).toBeNull();
    });

    it('should not set involvedPeople when the task dose not have groupmembers', async(() => {
        const taskDetails = taskDetailsWithOutInvolvedPeopleMock;
        const change = new SimpleChange('123', taskDetails, true);
        component.ngOnChanges({ 'taskDetails': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(component.taskPeople).toBeNull();
        });
    }));

    it('should set involvedPeople when the task has groupmembers', async(() => {
        const taskDetails = taskDetailsWithInvolvedPeopleMock;
        const change = new SimpleChange('123', taskDetails, true);
        component.ngOnChanges({ 'taskDetails': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(component.taskPeople).not.toBeNull();
            expect(component.taskPeople.length).toBe(2);
            expect(component.taskPeople[0]).toBe(fakeUser2);
            expect(component.taskPeople[1]).toBe(fakeUser3);
        });
    }));
});
