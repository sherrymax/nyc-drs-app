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
import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';
import { ProcessInstanceListComponent, ProcessService } from '@alfresco/adf-process-services';
import { ProcessListPaginatorComponent } from './processlist-paginator.component';
import { defaultFakeProcessFilter, fakeProcessInstances } from '../../test-mock';

describe('ProcessListPaginatorComponent', () => {
    let component: ProcessListPaginatorComponent;
    let fixture: ComponentFixture<ProcessListPaginatorComponent>;
    let element: HTMLElement;
    let appConfig: AppConfigService;
    let service: ProcessService;
    let getProcessInstancesSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProcessListPaginatorComponent,
                ProcessInstanceListComponent
            ],
            providers: [UserPreferencesService, ProcessService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessListPaginatorComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        appConfig = TestBed.get(AppConfigService);
        service = fixture.debugElement.injector.get(ProcessService);
        appConfig.config = Object.assign(appConfig.config, {
            'adf-process-list': {
                'presets': {
                    'running': [
                        {
                            'key': 'name',
                            'type': 'text',
                            'title': 'ADF_PROCESS_LIST.PROPERTIES.NAME',
                            'cssClass': 'dw-dt-col-4 ellipsis-cell',
                            'sortable': true
                        }
                    ]
                }
            }
        });
        getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(Observable.of(fakeProcessInstances));
        component.currentFilter = defaultFakeProcessFilter;
        fixture.detectChanges();
    });

    it('should create instance of ProcessListPaginatorComponent', () => {
        expect(fixture.componentInstance instanceof ProcessListPaginatorComponent).toBe(true, 'should create ProcessPaginatorComponent');
    });

    it('should define an adfProcessInstancelist and adf-pagination', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const adfProcessList = fixture.debugElement.nativeElement.querySelector('#apw-process-list-id');
            const adfPagination = fixture.debugElement.nativeElement.querySelector('.adf-pagination');
            expect(adfPagination).toBeDefined();
            expect(adfProcessList).toBeDefined();
        });
    }));

    it('should display processInstances on processList', () => {
        fixture.detectChanges();
        const value1 = fixture.debugElement.query(By.css(`[data-automation-id="text_Process 382927392"`));
        const value2 = fixture.debugElement.query(By.css(`[data-automation-id="text_Process 773443333"]`));
        expect(value1).not.toBeNull();
        expect(value1.nativeElement.innerText.trim()).toBe('Process 382927392');
        expect(value2.nativeElement.innerText.trim()).toBe('Process 773443333');
    });

    it('should display processList coloumns', () => {
        fixture.detectChanges();
        const StartedElement = fixture.debugElement.query(By.css(`[data-automation-id="auto_id_startedBy"`));
        const NameElement = fixture.debugElement.query(By.css(`[data-automation-id="auto_id_name"]`));
        expect(StartedElement).not.toBeNull();
        expect(NameElement).not.toBeNull();
        expect(StartedElement.nativeElement.innerText.trim()).toBe('ADF_PROCESS_LIST.PROPERTIES.CREATED_BY');
        expect(NameElement.nativeElement.innerText.trim()).toBe('ADF_PROCESS_LIST.PROPERTIES.NAME');
    });

    it('should define an adf-pagination', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const adfPagination = fixture.debugElement.nativeElement.querySelector('.adf-pagination');
            const pageRange = fixture.debugElement.query(By.css('.adf-pagination__range'));
            const pageSizeElement = fixture.debugElement.query(By.css('.adf-pagination__perpage-block'));
            const pageSize = fixture.debugElement.query(By.css('.adf-pagination__max-items'));
            expect(adfPagination).toBeDefined();
            expect(pageSizeElement.nativeElement.innerText.trim()).toBe('CORE.PAGINATION.ITEMS_PER_PAGE 25  arrow_drop_down');
            expect(pageRange.nativeElement.innerText.trim()).toBe('CORE.PAGINATION.ITEMS_RANGE');
            expect(pageSize.nativeElement.innerText.trim()).toBe('25');
        });
    }));
});
