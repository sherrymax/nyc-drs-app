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

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthenticationService, LogService, BpmUserService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

    let authService: AuthenticationService;
    let userBpmService: BpmUserService;

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderComponent,
            ],
            providers: [AuthenticationService, LogService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        authService = fixture.debugElement.injector.get(AuthenticationService);
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        userBpmService = fixture.debugElement.injector.get(BpmUserService);
        spyOn(userBpmService, 'getCurrentUserInfo').and.returnValue(Observable.of({id: 1001}));
        spyOn(userBpmService, 'getCurrentUserProfileImage').and.returnValue('./fake.png');
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create instance of HeaderComponent', () => {
        expect(component).toBeDefined();
        expect(fixture.componentInstance instanceof HeaderComponent).toBe(true, 'should create HeaderComponent');
    });

    it('should display apw appName', () => {
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('#apw-logo-id');
        expect(element.innerText).toBe('DW-HEADER.APPS-DESKTOP');
    });

    it('should define adfUserinfo and apwUserProfileMenu', () => {
        fixture.detectChanges();
        const adfUserinfo = fixture.debugElement.nativeElement.querySelector('adf-userinfo ');
        const apwUserProfileMenu = fixture.debugElement.nativeElement.querySelector('apw-user-profile-menu');
        expect(adfUserinfo).toBeDefined();
        expect(apwUserProfileMenu).toBeDefined();
    });
});

@Component({
    template: `
        <apw-header>
            <button mat-icon-button class="dw-activiti-app-menu-toggle">
                <mat-icon>menu</mat-icon>
            </button>
        </apw-header>`
})

class CustomHeaderComponent {}

describe('Custom HeaderComponent', () => {
    let fixture: ComponentFixture<CustomHeaderComponent>;
    let component: CustomHeaderComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderComponent,
                CustomHeaderComponent
            ],
            imports: [
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomHeaderComponent);
        authService = fixture.debugElement.injector.get(AuthenticationService);
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        userBpmService = fixture.debugElement.injector.get(BpmUserService);
        spyOn(userBpmService, 'getCurrentUserInfo').and.returnValue(Observable.of({id: 1001}));
        spyOn(userBpmService, 'getCurrentUserProfileImage').and.returnValue('./assets/alfresco_apps_logo.png');
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of CustomHeaderComponent', () => {
        expect(component instanceof CustomHeaderComponent).toBe(true, 'should create CustomHeaderComponent');
    });

    it('should able inject ng-content', () => {
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('.dw-activiti-app-menu-toggle');
        fixture.detectChanges();
        expect(element.innerText).toBe('menu');
    });
});
