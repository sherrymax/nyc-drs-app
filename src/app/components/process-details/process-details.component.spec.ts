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
import { ProcessDetailsComponent } from './process-details.component';
import { fakeRunningProcessInstance, fakeProcessInstance } from '../../test-mock';
import { TaskAuditDirective } from '@alfresco/adf-process-services';

describe('ProcessDetailsComponent', () => {

    let component: ProcessDetailsComponent;
    let fixture: ComponentFixture<ProcessDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProcessDetailsComponent,
                TaskAuditDirective
            ],
            providers: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessDetailsComponent);
        component = fixture.componentInstance;
        component.processInstanceDetails = fakeRunningProcessInstance;
        fixture.detectChanges();
    });

    it('should create instance of ProcessDetailsComponent', () => {
        expect(fixture.componentInstance instanceof ProcessDetailsComponent).toBe(true);
    });

    it('should define adf-tasklist', () => {
        fixture.detectChanges();
        const adfTasklist = fixture.debugElement.nativeElement.querySelector('#dw-tasklist-id');
        expect(adfTasklist).toBeDefined();
    });

    it('should define adf-diagram', () => {
        fixture.detectChanges();
        const adfDiagram = fixture.debugElement.nativeElement.querySelector('#dw-diagram-id');
        expect(adfDiagram).toBeDefined();
        expect(adfDiagram).not.toBeNull();
    });

    it('should not show adf-diagram if process is completed', () => {
        component.processInstanceDetails = fakeProcessInstance;
        fixture.detectChanges();
        const adfDiagram = fixture.debugElement.nativeElement.querySelector('#dw-diagram-id');
        expect(adfDiagram).toBeNull();
    });
});
