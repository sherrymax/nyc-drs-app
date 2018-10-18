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
import { AppContainerComponent } from './app-container.component';

describe('AppContainerComponent', () => {
    let component: AppContainerComponent;
    let fixture: ComponentFixture<AppContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppContainerComponent
                ],
            providers: [
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppContainerComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of AppsComponent', () => {
        expect(fixture.componentInstance instanceof AppContainerComponent).toBe(true, 'should AppContainerComponent');
    });

    it('should define apw-header', () => {
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('apw-header');
        expect(element).toBeDefined();
    });

    it('should define apw-side-menu', () => {
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('apw-side-menu');
        expect(element).toBeDefined();
    });
});
