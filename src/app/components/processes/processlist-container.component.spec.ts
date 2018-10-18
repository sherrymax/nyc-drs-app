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
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppsProcessService } from '@alfresco/adf-core';
import { ProcessFilterService, ProcessService } from '@alfresco/adf-process-services';

import { defaultFakeProcessFilter, fakeApp1, fakeProcessInstance } from '../../test-mock';
import { ProcessListContainerComponent } from './processlist-container.component';

describe('ProcessListContainerComponent', () => {

    let component: ProcessListContainerComponent;
    let fixture: ComponentFixture<ProcessListContainerComponent>;
    let element: HTMLElement;
    let processService: ProcessService;
    let appsService: AppsProcessService;
    let processFilterService: ProcessFilterService;
    let getProcessSpy: jasmine.Spy;
    let getApplicationDetailsByIdSpy: jasmine.Spy;
    let getProcessFilterByNameSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProcessListContainerComponent
            ],
            providers: [
                ProcessService,
                ProcessFilterService,
                AppsProcessService,
                {
                provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({processFilterId: '123'}),
                        parent: {params: Observable.of({appId: '321'})}
                    }
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessListContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        processService = fixture.debugElement.injector.get(ProcessService);
        processFilterService = fixture.debugElement.injector.get(ProcessFilterService);
        appsService = fixture.debugElement.injector.get(AppsProcessService);
        getProcessSpy = spyOn(processService, 'getProcess').and.returnValue(Observable.of(fakeProcessInstance));
        getApplicationDetailsByIdSpy = spyOn(appsService, 'getApplicationDetailsById').and.returnValue(Observable.of(fakeApp1));
        getProcessFilterByNameSpy = spyOn(processFilterService, 'getProcessFilterByName')
                                    .and.returnValue(Observable.of(defaultFakeProcessFilter));
        spyOn(processFilterService, 'getProcessFilterById').and.returnValue(Observable.of(defaultFakeProcessFilter));
        fixture.detectChanges();
    });

    it('should create instance of ProcessListContainerComponent', () => {
        expect(fixture.componentInstance instanceof ProcessListContainerComponent)
        .toBe(true, 'should create ProcessListContainerComponent instance');
    });

    it('should get params from routing', () => {
        fixture.detectChanges();
        expect(component.filterId).toBe(123);
        expect(component.appId).toBe(321);
    });

    it('should fetch default Processfilter by FilterName', () => {
        fixture.detectChanges();
        expect(getProcessFilterByNameSpy).toHaveBeenCalled();
        expect(component.defaultFilterId).toBe('333');
    });

    it('should call service to get process instance', () => {
        component.loadProcessDetails('MyProcess:1021');
        fixture.detectChanges();
        expect(getProcessSpy).toHaveBeenCalledWith('MyProcess:1021');
        expect(component.processInstanceDetails.name).toBe('Process 773443333');
    });

    it('should call service to fetch appDetails', () => {
        fixture.detectChanges();
        expect(getApplicationDetailsByIdSpy).toHaveBeenCalled();
        expect(component.selectedAppName).toBe('Expense processes');
    });

    it('should define rows and columns', () => {
        fixture.detectChanges();
        expect(component.dataProcesses.getColumns).toBeDefined();
        expect(component.dataProcesses.getRows).toBeDefined();
        expect(component.dataProcesses.sort).toBeDefined();
    });

    it('should define activiti-process-instance-list', () => {
        fixture.detectChanges();
        const activitiProcessInstanceList = element.querySelector('adf-process-instance-list');
        expect(activitiProcessInstanceList).toBeDefined();
    });

    it('should define dw-process-instance-details', () => {
        component.currentProcessInstanceId = '12';
        fixture.detectChanges();
        const adfProcessInstanceDetails = element.querySelector('dw-process-instance-details');
        expect(adfProcessInstanceDetails).toBeDefined();
    });

    it('should define dw-process-full-form', () => {
        component.currentProcessInstanceId = '12';
        fixture.detectChanges();
        const dwProcessFullform = element.querySelector('dw-process-full-form');
        expect(dwProcessFullform).toBeDefined();
    });

    it('should define a dialog', () => {
        const dialog = fixture.debugElement.nativeElement.querySelector('.alf-am-task-modal');
        expect(dialog).toBeDefined();
    });

    it('should define process sidebar', () => {
        component.processInstanceDetails = fakeProcessInstance;
        component.showSidebar = true;
        fixture.detectChanges();
        const IconElement = fixture.debugElement.nativeElement.querySelector('#dw-processlist-sidebar-open-new-id');
        const sidebar = fixture.debugElement.nativeElement.querySelector('#dw-processlist-sidebar-id');
        expect(sidebar).toBeDefined();
        expect(IconElement.innerText).toBe('open_in_new');
    });

    it('should not show process sidebar if showSidebar is false', () => {
        component.processInstanceDetails = fakeProcessInstance;
        component.showSidebar = false;
        fixture.detectChanges();
        const IconElement = fixture.debugElement.nativeElement.querySelector('#dw-processlist-sidebar-open-new-id');
        const sidebar = fixture.debugElement.nativeElement.querySelector('#dw-processlist-sidebar-id');
        expect(sidebar).toBeNull();
        expect(IconElement).toBeNull();
    });
});
