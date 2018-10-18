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
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { TaskListService, TaskListComponent} from '@alfresco/adf-process-services';
import { AppConfigService } from '@alfresco/adf-core';
import { TaskListPaginatorComponent } from './tasklist-paginator.component';
import { fakeFilterRepresentationModel, fakeTaskList } from '../../test-mock';

describe('TaskListPaginatorComponent', () => {
    let component: TaskListPaginatorComponent;
    let fixture: ComponentFixture<TaskListPaginatorComponent>;
    let appConfig: AppConfigService;
    let service: TaskListService;
    let getTasksSpy: jasmine.Spy;
    let findTasksByStateSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskListPaginatorComponent,
                TaskListComponent
            ],
            providers: [
                TaskListService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskListPaginatorComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.get(AppConfigService);
        service = fixture.debugElement.injector.get(TaskListService);
        appConfig.config = Object.assign(appConfig.config, {
            'adf-task-list': {
                'presets': {
                    'dw-task-list': [
                        {
                            'key': 'name',
                            'type': 'text',
                            'title': 'ADF_TASK_LIST.PROPERTIES.NAME',
                            'cssClass': 'dw-dt-col-4 ellipsis-cell',
                            'sortable': true
                        }
                    ]
                }
            }
        });
        getTasksSpy = spyOn(service, 'findAllTasksWithoutState').and.returnValue(Observable.of(fakeTaskList));
        findTasksByStateSpy = spyOn(service, 'findTasksByState').and.returnValue(Observable.of(fakeTaskList));
        component.currentFilter = fakeFilterRepresentationModel;
        fixture.detectChanges();
    });

    it('should create instance of TaskListPaginatorComponent', () => {
        expect(fixture.componentInstance instanceof TaskListPaginatorComponent).toBe(true, 'should create TaskListPaginatorComponent');
    });

    it('should define an adfTasklist', () => {
        fixture.detectChanges();
        const adfTasklist = fixture.debugElement.nativeElement.querySelector('.adf-tasklist');
        expect(adfTasklist).toBeDefined();
    });

    it('should define an adf-pagination', () => {
        fixture.detectChanges();
        const adfPagination = fixture.debugElement.nativeElement.querySelector('.adf-pagination');
        const pageRange = fixture.debugElement.query(By.css('.adf-pagination__range'));
        const pageSizeElement = fixture.debugElement.query(By.css('.adf-pagination__perpage-block'));
        const pageSize = fixture.debugElement.query(By.css('.adf-pagination__max-items'));
        expect(adfPagination).toBeDefined();
        expect(pageSizeElement.nativeElement.innerText.trim()).toBe('CORE.PAGINATION.ITEMS_PER_PAGE 25  arrow_drop_down');
        expect(pageRange.nativeElement.innerText.trim()).toBe('CORE.PAGINATION.ITEMS_RANGE');
        expect(pageSize.nativeElement.innerText.trim()).toBe('25');
    });

    it('should display taskdetails on taskList', () => {
        fixture.detectChanges();
        const value1 = fixture.debugElement.query(By.css(`[data-automation-id="text_Task-1"`));
        const value2 = fixture.debugElement.query(By.css(`[data-automation-id="text_Task-2"]`));
        expect(value1).not.toBeNull();
        expect(value1.nativeElement.innerText.trim()).toBe('Task-1');
        expect(value2.nativeElement.innerText.trim()).toBe('Task-2');
    });

    it('should display taskList coloumns', () => {
        fixture.detectChanges();
        const assigneElement = fixture.debugElement.query(By.css(`[data-automation-id="auto_id_assignee"`));
        const NameElement = fixture.debugElement.query(By.css(`[data-automation-id="auto_id_name"]`));
        expect(assigneElement).not.toBeNull();
        expect(NameElement).not.toBeNull();
        expect(assigneElement.nativeElement.innerText.trim()).toBe('ADF_TASK_LIST.PROPERTIES.ASSIGNEE');
        expect(NameElement.nativeElement.innerText.trim()).toBe('ADF_TASK_LIST.PROPERTIES.NAME');
    });
});
