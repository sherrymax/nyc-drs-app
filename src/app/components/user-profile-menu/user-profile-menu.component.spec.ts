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

import { UserProfileMenuComponent } from './user-profile-menu.component';

describe('UserProfileMenu', () => {
    let component: UserProfileMenuComponent;
    let fixture: ComponentFixture<UserProfileMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UserProfileMenuComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserProfileMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create instance of UserProfileMenuComponent', () => {
        expect(component).toBeDefined();
        expect(fixture.componentInstance instanceof UserProfileMenuComponent).toBe(true, 'should create UserProfileMenuComponent');
    });

    it('should emit onMenuClick on click of profile menu', () => {
        const menuNameSpy = spyOn(component.onMenuClick, 'emit');
        const element = fixture.debugElement.nativeElement.querySelector('#dw-menu-button-id');
        fixture.detectChanges();
        component.menuClick('logout');
        expect(element).toBeDefined();
        expect(menuNameSpy).toHaveBeenCalledWith('logout');
    });
});
