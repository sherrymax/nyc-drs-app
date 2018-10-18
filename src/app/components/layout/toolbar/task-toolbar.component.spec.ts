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
import 'rxjs/add/observable/of';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TaskToolbarComponent } from './task-toolbar.component';
import { TaskListService, TaskAuditDirective } from '@alfresco/adf-process-services';
import { mockPdfData } from '../../../test-mock';

describe('TaskToolbarComponent', () => {

    let component: TaskToolbarComponent;
    let fixture: ComponentFixture<TaskToolbarComponent>;
    let taskService: TaskListService;

    function createFakePdfBlob(): Blob {
        const pdfData = mockPdfData;
        return new Blob([pdfData], { type: 'application/pdf' });
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskToolbarComponent,
                TaskAuditDirective
            ],
            providers: [TaskListService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskToolbarComponent);
        component = fixture.componentInstance;
        taskService = TestBed.get(TaskListService);
        fixture.detectChanges();
    });

    xit('should create instance of CreateProcessComponent', () => {
        expect(fixture.componentInstance instanceof TaskToolbarComponent).toBe(true);
    });

    xit('should emit onBackClick on click of back button', () => {
        component.selectedAction = 'info';
        const onbackEmitSpy = spyOn(component.onBackClick, 'emit');
        fixture.detectChanges();
        const backButton = fixture.debugElement.nativeElement.querySelector('#backButton');
        backButton.click();
        expect(onbackEmitSpy).toBeDefined();
        expect(onbackEmitSpy).toHaveBeenCalled();
    });

    xit('should display No name if task name is empty', () => {
        component.selectedAction = 'info';
        component.name = '';
        component.appName = 'fakeAppName';
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('#name');
        expect(element).toBeDefined();
        expect(element.innerText).toBe('DW-TOOLBAR.TITLE.NO-NAME in fakeAppName');
    });

    xit('should define a adftoolbar', () => {
        component.selectedAction = 'info';
        fixture.detectChanges();
        const adfToolbar = fixture.debugElement.nativeElement.querySelector('adf-toolbar');
        const adfTaskDetails = fixture.debugElement.nativeElement.querySelector('adf-toolbar-title');
        expect(adfTaskDetails).toBeDefined();
        expect(adfToolbar).toBeDefined();
    });

    describe('On TaskAudit', () => {

        beforeEach(async(() => {
            component.name = 'Task Name';
            component.id = 'taskID';
            component.fileName = 'fake-name';
            component.selectedAction = 'info';
        }));

        xit('should display the task name', () => {
            component.appName = 'fakeAppName';
            fixture.detectChanges();
            const element = fixture.nativeElement.querySelector('#name');
            expect(element.innerText).toBe('Task Name in fakeAppName');
        });

        xit('should download Task audit on click of TaskAudit Button', async(() => {
            component.auditDownload = true;
            const blob = createFakePdfBlob();
            spyOn(taskService, 'fetchTaskAuditPdfById').and.returnValue(Observable.of(blob));
            const onAuditClickSpy = spyOn(component.clicked, 'emit');
            fixture.detectChanges();
            const button = fixture.nativeElement.querySelector('#taskauditButton');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(onAuditClickSpy).toHaveBeenCalled();
            });
            button.click();
        }));
    });
});
