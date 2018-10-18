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
import { LogService } from '@alfresco/adf-core';
import { SettingComponent } from '../setting/setting.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

describe('SettingComponent', () => {
    let fixture: ComponentFixture<SettingComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SettingComponent
            ],
            providers: [
                LogService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingComponent);
    });

    it('should create instance of Setting Component', () => {
        expect(fixture.componentInstance instanceof SettingComponent).toBe(true, 'should setting component');
    });

});
