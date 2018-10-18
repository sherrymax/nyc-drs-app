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
import 'rxjs/add/observable/fromPromise';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DashboardSettingsComponent } from './dashboard-settings.component';
import { AnalyticsService } from '@alfresco/adf-insights';
import { fakeprocessDefinitions } from '../../test-mock';

describe('DashboardSettingsComponent', () => {

    let component: DashboardSettingsComponent;
    let fixture: ComponentFixture<DashboardSettingsComponent>;
    let analyticsService: AnalyticsService;
    let getProcessDefinitionsSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DashboardSettingsComponent
            ],
            providers: [ AnalyticsService ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardSettingsComponent);
        component = fixture.componentInstance;
        analyticsService = fixture.debugElement.injector.get(AnalyticsService);
        getProcessDefinitionsSpy = spyOn(analyticsService, 'getProcessDefinitionsValues')
                                    .and.returnValue(Observable.of(fakeprocessDefinitions));
        fixture.detectChanges();
    });

    it('should create instance of DashboardSettingsComponent', () => {
        expect(fixture.componentInstance instanceof DashboardSettingsComponent).toBe(true);
    });

    it('should display dashboard setting title and subtitle', () => {
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#dashboard-setting-title-id');
        const subtitle = fixture.debugElement.nativeElement.querySelector('#dashboard-setting-subtitle-id');
        expect(title).toBeDefined();
        expect(title.innerText).toBe('DASHBOARD-SETTINGS.TITLE');
        expect(subtitle.innerText).toBe('DASHBOARD-SETTINGS.SUBTITLE');
    });

    it('should display dashboard fromDate and toDate', () => {
        component.fromDate.toDate();
        component.toDate.toDate();
        fixture.detectChanges();
        const fromDate = fixture.debugElement.nativeElement.querySelector('#fromdate-id');
        const toDate = fixture.debugElement.nativeElement.querySelector('#fromdate-id');
        const dateLable = fixture.debugElement.nativeElement.querySelector('#fromdate-lable-id');
        expect(fromDate).toBeDefined();
        expect(toDate).toBeDefined();
        expect(dateLable.innerText).toBe('DASHBOARD-SETTINGS.START-DATE');
    });

    it('should call service to fetch process definitions with appId', () => {
        component.appId = 1002;
        fixture.detectChanges();
        expect(getProcessDefinitionsSpy).toHaveBeenCalled();
    });

    it('should call service to fetch process definitions without appId', () => {
        component.appId = null;
        fixture.detectChanges();
        expect(getProcessDefinitionsSpy).toHaveBeenCalled();
    });

    it('should display the app definitions and status', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectElement = fixture.nativeElement.querySelector('mat-select > .mat-select-trigger');
            const optionElement = fixture.nativeElement.querySelectorAll('mat-option');
            selectElement.click();
            expect(selectElement).not.toBeNull();
            expect(selectElement).toBeDefined();
            expect(optionElement).not.toBeNull();
            expect(optionElement).toBeDefined();
        });
    }));

    it('should define the process definitions select label', () => {
        fixture.detectChanges();
        const selectProcessDefLabel = fixture.nativeElement.querySelector('.dw-dashboard-label');
        expect(selectProcessDefLabel).not.toBeNull();
        expect(selectProcessDefLabel.innerText).toBe('DASHBOARD-SETTINGS.PROCESS-DEFINITION');
    });
});
