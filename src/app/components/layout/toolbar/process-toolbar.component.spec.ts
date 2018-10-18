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
import { ProcessToolbarComponent } from './process-toolbar.component';
import { ProcessService, ProcessAuditDirective } from '@alfresco/adf-process-services';
import { mockPdfData } from '../../../test-mock';

describe('ProcessToolbarComponent', () => {

    let component: ProcessToolbarComponent;
    let fixture: ComponentFixture<ProcessToolbarComponent>;
    let processService: ProcessService;

    function createFakePdfBlob(): Blob {
        const pdfData = mockPdfData;
        return new Blob([pdfData], { type: 'application/pdf' });
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProcessToolbarComponent,
                ProcessAuditDirective
            ],
            providers: [ProcessService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessToolbarComponent);
        component = fixture.componentInstance;
        processService = TestBed.get(ProcessService);
        fixture.detectChanges();
    });

    xit('should create instance of ProcessToolbarComponent', () => {
        expect(fixture.componentInstance instanceof ProcessToolbarComponent).toBe(true);
    });

    xit('should emit iconClick on click of back button', () => {
        component.selectedAction = 'info';
        const onbackEmitSpy = spyOn(component.iconClick, 'emit');
        fixture.detectChanges();
        const backButton = fixture.debugElement.nativeElement.querySelector('#backButton');
        backButton.click();
        expect(onbackEmitSpy).toBeDefined();
        expect(onbackEmitSpy).toHaveBeenCalled();
    });

    xit('should display process name', () => {
        component.selectedAction = 'info';
        component.name = '';
        component.appName = 'fakeAppName';
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('#process-name');
        expect(element).toBeDefined();
        expect(element.innerText).toBe('in fakeAppName');
    });

    xit('should define a adftoolbar', () => {
        component.selectedAction = 'info';
        fixture.detectChanges();
        const adfToolbar = fixture.debugElement.nativeElement.querySelector('adf-toolbar');
        const adfTaskDetails = fixture.debugElement.nativeElement.querySelector('adf-toolbar-title');
        expect(adfTaskDetails).toBeDefined();
        expect(adfToolbar).toBeDefined();
    });

    xit('should able to cancel process on click of cancel icon', () => {
        component.selectedAction = 'info';
        component.disableButton = false;
        const cancleButton = spyOn(component.iconClick, 'emit');
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('#process-cancel-button');
        element.click();
        expect(element).toBeDefined();
        expect(element.isEnabled()).toBeTruthy();
        expect(cancleButton).toHaveBeenCalled();
    });

    xit('should disable cancel icon on when process canceled', () => {
        component.selectedAction = 'info';
        component.disableButton = true;
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('#process-cancel-button');
        expect(element).toBeDefined();
        expect(element.isEnabled()).toBeFalsy();
    });

    describe('On ProcessAudit', () => {

        beforeEach(async(() => {
            component.name = 'fake-name';
            component.id = 'process:fake-id';
            component.fileName = 'fake-name';
            component.selectedAction = 'info';
        }));

        xit('should display the process name on detail-page', () => {
            component.appName = 'fakeAppName';
            fixture.detectChanges();
            const element = fixture.nativeElement.querySelector('#process-name');
            expect(element).toBeDefined();
            expect(element.innerText).toBe('Process Name in fakeAppName');
        });

        xit('should display the process name on activiti-page', () => {
            component.appName = 'fakeAppName';
            fixture.detectChanges();
            const element = fixture.nativeElement.querySelector('#process-name');
            expect(element).toBeDefined();
            expect(element.innerText).toBe('Process Name');
        });

        xit('should download Process audit on click of ProcessAudit Button', async(() => {
            component.auditDownload = true;
            const blob = createFakePdfBlob();
            spyOn(processService, 'fetchProcessAuditPdfById').and.returnValue(Observable.of(blob));
            const onAuditClickSpy = spyOn(component.clicked, 'emit');
            fixture.detectChanges();
            const button = fixture.nativeElement.querySelector('#processauditButton');
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(onAuditClickSpy).toHaveBeenCalled();
            });
            button.click();
        }));
    });
});
