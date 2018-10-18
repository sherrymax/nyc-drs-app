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
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TaskDetailsContainerComponent } from './task-details-container.component';
import { DialogConfirmationComponent } from '../layout';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { AppsProcessService, ContentLinkModel} from '@alfresco/adf-core';
import { TaskListService, TaskFilterService } from '@alfresco/adf-process-services';
import { fakeApp1, taskDetailsMock, fakeTaskDefaultFilter } from '../../test-mock';

describe('TaskDetailsContainerComponent', () => {

    let component: TaskDetailsContainerComponent;
    let fixture: ComponentFixture<TaskDetailsContainerComponent>;
    let taskListService: TaskListService;
    let appsService: AppsProcessService;
    let taskFilterService: TaskFilterService;
    let getTaskDetailsSpy: jasmine.Spy;
    let getTaskFilterByNameSpy: jasmine.Spy;
    let getApplicationDetailsByIdSpy: jasmine.Spy;

    function createFakePdfBlob(): Blob {
        const pdfData = atob(
            'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
            'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
            'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
            'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
            'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
            'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
            'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
            'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
            'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
            'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
            'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
            'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
            'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
        return new Blob([pdfData], { type: 'application/pdf' });
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskDetailsContainerComponent,
                DialogConfirmationComponent
            ],
            providers: [
                TaskListService,
                AppsProcessService,
                TaskFilterService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: { params: Observable.of({ appId: 123 }) },
                        params: Observable.of({ taskId: 1001 }),
                    }
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskDetailsContainerComponent);
        component = fixture.componentInstance;
        taskListService = fixture.debugElement.injector.get(TaskListService);
        appsService = fixture.debugElement.injector.get(AppsProcessService);
        taskFilterService = fixture.debugElement.injector.get(TaskFilterService);
        getApplicationDetailsByIdSpy = spyOn(appsService, 'getApplicationDetailsById').and.returnValue(Observable.of(fakeApp1));
        getTaskDetailsSpy = spyOn(taskListService, 'getTaskDetails').and.returnValue(Observable.of(taskDetailsMock));
        getTaskFilterByNameSpy = spyOn(taskFilterService, 'getTaskFilterByName').and.returnValue(Observable.of(fakeTaskDefaultFilter));
        fixture.detectChanges();
    });

    it('should create instance of TaskDetailsContainerComponent', () => {
        expect(fixture.componentInstance instanceof TaskDetailsContainerComponent).toBe(true);
    });

    it('should call service to get taskDetails', () => {
        fixture.detectChanges();
        expect(getTaskDetailsSpy).toHaveBeenCalled();
        expect(component.taskDetails.id).toBe('91');
        expect(component.taskDetails.name).toBe('Request translation');
        expect(component.taskDetails.assignee.firstName).toBe('Admin');
    });

    it('should call service to get appName', () => {
        fixture.detectChanges();
        expect(getApplicationDetailsByIdSpy).toHaveBeenCalled();
        expect(component.appName).toBe('Expense processes');
    });

    it('should call service to fetch taskFilter', () => {
        fixture.detectChanges();
        component.oncloseIconClick();
        expect(getTaskFilterByNameSpy).toHaveBeenCalled();
    });

    describe('task details', () => {

        beforeEach(() => {
            component.appName = 'Fake-Name';
            component.taskDetails = taskDetailsMock;
        });

        it('should define apw-task-toolbar', () => {
            component.activeTab = 1;
            fixture.detectChanges();
            const apwtoolbar = fixture.debugElement.nativeElement.querySelector('#apw-task-toolbar-id');
            expect(apwtoolbar).toBeDefined();
        });

        it('should display taskSidebar when showInfoDrawer is true ', () => {
            component.showInfoDrawer = true;
            fixture.detectChanges();
            const taskSidebar = fixture.debugElement.nativeElement.querySelector('#apw-task-sidebar-id');
            expect(taskSidebar).not.toBeNull();
        });

        it('should not display taskSidebar when showInfoDrawer is false ', () => {
            component.showInfoDrawer = false;
            fixture.detectChanges();
            const taskSidebar = fixture.debugElement.nativeElement.querySelector('#apw-task-sidebar-id');
            expect(taskSidebar).toBeNull();
        });

        it('should not define apwTaskAttachment on detail view', () => {
            component.activeTab = 0;
            fixture.detectChanges();
            const apwTaskForm = fixture.debugElement.nativeElement.querySelector('#apw-task-form-id');
            const apwTaskAttachment = fixture.debugElement.nativeElement.querySelector('#apw-task-attachment-id');
            expect(apwTaskAttachment).toBeNull();
            expect(apwTaskForm).toBeDefined();
            expect(apwTaskForm).not.toBeNull();
        });

        it('should not define apwTaskFormDetails on active view', () => {
            component.activeTab = 1;
            fixture.detectChanges();
            const apwTaskForm = fixture.debugElement.nativeElement.querySelector('#apw-task-form-id');
            const apwTaskAttachment = fixture.debugElement.nativeElement.querySelector('#apw-task-attachment-id');
            expect(apwTaskAttachment).toBeDefined();
            expect(apwTaskAttachment).not.toBeNull();
            expect(apwTaskForm).toBeNull();
        });
    });

    it('should define adf-viewer and adf-viewer-more-actions', () => {
        const blob = createFakePdfBlob();
        const contentLinkModelMock = new ContentLinkModel({
            id: 4004,
            name: 'FakeBlob.pdf',
            created: 1490354907883,
            createdBy: {
                id: 2,
                firstName: 'dasdas', 'lastName': 'dasads', 'email': 'administrator@admin.com'
            },
            relatedContent: false,
            contentAvailable: true,
            link: false,
            mimeType: 'application/pdf',
            simpleType: 'pdf',
            previewStatus: 'created',
            thumbnailStatus: 'created'
        });
        contentLinkModelMock.contentBlob = blob;
        component.onContentClick(contentLinkModelMock);
        fixture.detectChanges();
        const adfViewerElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-id');
        const adfViewerMoreActionElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-more-action-id');
        const adfViewerdisplayName = fixture.debugElement.nativeElement.querySelector('#adf-viewer-display-name');
        expect(adfViewerElement).toBeDefined();
        expect(adfViewerMoreActionElement).toBeDefined();
        expect(adfViewerElement).not.toBeNull();
        expect(adfViewerdisplayName.innerText).toBe('FakeBlob.pdf');
    });

    it('should not define adf-viewer and adf-viewer-more-actions when the contentblob is empty', () => {
        fixture.detectChanges();
        const adfViewerElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-id');
        const adfViewerMoreActionElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-more-action-id');
        const adfViewerdisplayName = fixture.debugElement.nativeElement.querySelector('#adf-viewer-display-name');
        expect(adfViewerElement).toBeNull();
        expect(adfViewerMoreActionElement).toBeNull();
        expect(adfViewerdisplayName).toBeNull();
    });

    it('should display dialog if discarding an unsaved form', async(() => {
        fixture.detectChanges();
        component.onFormChanged({});
        fixture.whenStable().then(() => {
            const el1 = window.document.querySelector('mat-dialog-container');
            expect(el1).toBeDefined();
        });
    }));

    it('should not display dialog if form is saved', async(() => {
        fixture.detectChanges();
        component.onFormChanged(null);
        fixture.whenStable().then(() => {
            const el1 = window.document.querySelector('mat-dialog-container');
            expect(el1).toBe(null);
        });
    }));
});
