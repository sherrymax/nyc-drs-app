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

import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
    LogService,
    BpmUserService,
    FormModel,
    FormService,
    AuthenticationService
} from '@alfresco/adf-core';
import { TaskListService, TaskDetailsModel } from '@alfresco/adf-process-services';

import { TaskFromComponent } from './task-form.component';
import {
    taskDetailsMock,
    taskDetailsWithOutFormMock,
    completedTaskDetailsMock,
    sameFakeFormValue,
    changedformModelMock,
    fakeForm,
    changedFakeFormValue
} from '../../test-mock';

@Injectable()
export class ActivatedRouteStub {
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    private _testParams: {};
    get testParams() {
        return this._testParams;
    }

    set testParams(params: {}) {
        this._testParams = params;
        this.subject.next(params);
    }
}

describe('TaskFromComponent', () => {
    let component: TaskFromComponent;
    let fixture: ComponentFixture<TaskFromComponent>;
    let service: TaskListService;
    let bpmUserservice: BpmUserService;
    let formService: FormService;
    let element: HTMLElement;
    let completeTaskSpy: jasmine.Spy;
    let bpmUserserviceSpy: jasmine.Spy;
    let formServiceSpy: jasmine.Spy;
    let activatedRouteStub;
    let authService: AuthenticationService;
    const bpmUserServiceStub = {
        getCurrentUserInfo() {
            return Observable.of({id: 1001});
        }
    };

    const formServiceStub = {
        formFieldValueChanged() {
            return changedformModelMock;
        }
    };

    beforeEach(async(() => {
        activatedRouteStub = new ActivatedRouteStub();
        TestBed.configureTestingModule({
            declarations: [
                TaskFromComponent
            ],
            providers: [
                TaskListService,
                LogService,
                FormService,
                AuthenticationService,
                { provide: BpmUserService, useValue: bpmUserServiceStub },
                { provide: formService, useValue: formServiceStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFromComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        authService = fixture.debugElement.injector.get(AuthenticationService);
            spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
            spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
        service = fixture.debugElement.injector.get(TaskListService);
        bpmUserservice = fixture.debugElement.injector.get(BpmUserService);
        formService = fixture.debugElement.injector.get(FormService);
        formServiceSpy = spyOn(formService, 'formFieldValueChanged').and.returnValue(changedformModelMock);
        bpmUserserviceSpy = spyOn(bpmUserservice, 'getCurrentUserInfo').and.returnValue(Observable.of({id: 1001}));
        spyOn(bpmUserservice, 'getCurrentUserProfileImage').and.returnValue('./fake.png');
        completeTaskSpy = spyOn(service, 'completeTask').and.returnValue(Observable.of({status: 'completed'}));
        activatedRouteStub.testParams = { appId: '321', taskId: '123' };
        fixture.detectChanges();
    });

    it('should create instance of TaskFromComponent', () => {
        expect(component instanceof TaskFromComponent).toBe(true);
    });

    it('should define adf-form', () => {
        component.taskDetails = new TaskDetailsModel(taskDetailsMock);
        fixture.detectChanges();
        const activitFormSelector = element.querySelector('adf-form');
        expect(activitFormSelector).toBeDefined();
    });

    it('should fetch current bpm user', () => {
        fixture.detectChanges();
        expect(bpmUserserviceSpy).toHaveBeenCalled();
    });

    it('should emit complete event when form completed', (done) => {
        component.complete.subscribe( (processInfo) => {
            expect(processInfo).toBeDefined();
            expect(processInfo.processDefinitionId).toEqual('TranslationProcess:2:8');
            expect(processInfo.processInstanceId).toEqual('86');
            done();
        });
        component.taskDetails = new TaskDetailsModel(taskDetailsMock);
        spyOn(component, 'onFormCompleted').and.callThrough();
        component.onFormCompleted(new FormModel());
    });

    it('should show form completed template if the task is completed', () => {
        component.taskDetails = new TaskDetailsModel(completedTaskDetailsMock);
        fixture.detectChanges();
        const activitFormSelector = element.querySelector('adf-form');
        const noFormMessage = fixture.debugElement.nativeElement.querySelector('#dw-completed-form-id');
        expect(activitFormSelector).toBeNull();
        expect(noFormMessage).toBeDefined();
        expect(noFormMessage.innerText).toContain('DW-TASK-FORM.COMPLETE-TASK-MESSAGE');
    });

    it('should show no form template if there is no formKey', () => {
        component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
        fixture.detectChanges();
        const activitFormSelector = element.querySelector('adf-form');
        const noFormMessage = fixture.debugElement.nativeElement.querySelector('#dw-no-form-id');
        expect(activitFormSelector).toBeNull();
        expect(noFormMessage).toBeDefined();
        expect(noFormMessage.innerText).toContain('DW-TASK-FORM.NO-FORM-MESSAGE');
    });

    it('should cancel no-form when cancel button is clicked', () => {
        const cancelSpy = spyOn(component.cancel, 'emit');
        component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
        fixture.detectChanges();
        const cancelButtonElement = fixture.debugElement.nativeElement.querySelector('.dw-task-button-cancel');
        cancelButtonElement.click();
        expect(cancelSpy).toHaveBeenCalled();
    });


    it('should complete no-form when complete button is clicked', () => {
        const navigateSpy = spyOn(component.navigate, 'emit');
        component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
        fixture.detectChanges();
        const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#dw-no-form-complete-button');
        completeButtonElement.click();
        expect(completeTaskSpy).toHaveBeenCalledWith('91');
        expect(navigateSpy).toHaveBeenCalled();
    });

    it('should not show no-form actions when the task is completed', () => {
        component.taskDetails = new TaskDetailsModel(completedTaskDetailsMock);
        fixture.detectChanges();
        const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#dw-no-form-complete-button');
        const cancelButtonElement = fixture.debugElement.nativeElement.querySelector('.dw-task-button-cancel');
        expect(completeButtonElement).toBeNull();
        expect(cancelButtonElement).toBeNull();
    });

    it('should emit formChange when form value changes ', () => {
        component.taskFormValues = JSON.stringify(sameFakeFormValue);
        const formChange = spyOn(component.formChange, 'emit');
        component.onFormChange();
        fixture.detectChanges();
        formService.formFieldValueChanged.next(<any>changedformModelMock);
        expect(formChange).toHaveBeenCalledWith(fakeForm);
    });

    it('should not emit formChange if no change in form values ', () => {
        component.taskFormValues = JSON.stringify(changedFakeFormValue);
        const formChange = spyOn(component.formChange, 'emit');
        formService.formFieldValueChanged.next(<any>changedformModelMock);
        component.onFormChange();
        fixture.detectChanges();
        expect(formChange).not.toHaveBeenCalled();
    });
});
