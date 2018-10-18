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
import { ProcessSidebarComponent } from './process-sidebar.component';
import { fakeProcessInstance } from '../../../test-mock';

describe('ProcessSidebarComponent', () => {

    let component: ProcessSidebarComponent;
    let fixture: ComponentFixture<ProcessSidebarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProcessSidebarComponent
            ],
            providers: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessSidebarComponent);
        component = fixture.componentInstance;
        component.processInstanceDetails = fakeProcessInstance;
        fixture.detectChanges();
    });

    it('should create instance of CreateProcessComponent', () => {
        expect(fixture.componentInstance instanceof ProcessSidebarComponent).toBe(true);
    });

    it('should define adf-info-drawer', () => {
        fixture.detectChanges();
        const adfUploadDragAarea = fixture.debugElement.nativeElement.querySelector('adf-info-drawer');
        const adfCreateTaskAttachment = fixture.debugElement.nativeElement.querySelector('adf-info-drawer-tab');
        expect(adfUploadDragAarea).toBeDefined();
        expect(adfCreateTaskAttachment).toBeDefined();
    });

    it('should define adf-process-instance-header', () => {
        fixture.detectChanges();
        const adfHeader = fixture.debugElement.nativeElement.querySelector('adf-process-instance-header');
        expect(adfHeader).toBeDefined();
    });

    it('should define adf-process-instance-comments', () => {
        fixture.detectChanges();
        const adfComments = fixture.debugElement.nativeElement.querySelector('adf-process-instance-comments');
        expect(adfComments).toBeDefined();
    });

    it('should not define adf comments/header if the processInstance is empty ', () => {
        fixture.detectChanges();
        const adfHeader = fixture.debugElement.nativeElement.querySelector('adf-task-header');
        const adfComments = fixture.debugElement.nativeElement.querySelector('adf-comments');
        expect(adfHeader).toBeNull();
        expect(adfComments).toBeNull();
    });
});
