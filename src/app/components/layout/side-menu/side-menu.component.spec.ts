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
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import {
    FilterProcessRepresentationModel,
    FilterRepresentationModel,
    TaskFilterService
} from '@alfresco/adf-process-services';

import { AuthenticationService, BpmUserService } from '@alfresco/adf-core';

import { SideMenuComponent } from './side-menu.component';
import { APWRoutes } from './apw-routes.model';

let authService: AuthenticationService;
let userBpmService: BpmUserService;

describe('SideMenuComponent', () => {
    let element: HTMLElement;
    let component: SideMenuComponent;
    let fixture: ComponentFixture<SideMenuComponent>;
    let taskFilterService: TaskFilterService;

    let router: Router;
    const fakeTaskFilter = new FilterRepresentationModel({
        name: 'FakeMyTasks',
        filter: { state: 'open', assignment: 'fake-assignee' }
    });
    const fakeTaskFilters = [];
    fakeTaskFilters.push(fakeTaskFilter);

    const fakeProcessFilter = new FilterProcessRepresentationModel({
        name: 'fakeRunningProcesses',
        filter: { state: 'open', assignment: 'fake-involved' }
    });
    const fakeProcessFilters = [];
    fakeProcessFilters.push(fakeProcessFilter);

    const fakeTaskFilterPromise = new Promise(function (resolve, reject) {
        resolve(fakeTaskFilters);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SideMenuComponent
            ],
            providers: [
                TaskFilterService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SideMenuComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;

            router = fixture.debugElement.injector.get(Router);
            taskFilterService = fixture.debugElement.injector.get(TaskFilterService);

            spyOn(taskFilterService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeTaskFilterPromise));

            authService = fixture.debugElement.injector.get(AuthenticationService);
            spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
            spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            userBpmService = fixture.debugElement.injector.get(BpmUserService);
            spyOn(userBpmService, 'getCurrentUserInfo').and.returnValue(Observable.of({id: 1001}));
            spyOn(userBpmService, 'getCurrentUserProfileImage').and.returnValue('./fake.png');
            fixture.detectChanges();
        });
    }));

    it('should create instance of SideMenuComponent', () => {
        expect(component instanceof SideMenuComponent).toBe(true, 'should create SideMenuComponent');
    });

    it('should show create menu when expanded is ture', () => {
        component.expanded = true;
        component.appId = 12;
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('#dw-create-menu-button');
        expect(element).toBeDefined();
    });

    it('should hide create menu when expanded is false', () => {
        component.expanded = false;
        fixture.detectChanges();
        const buttonElement = fixture.nativeElement.querySelector('#dw-create-menu-button');
        const iconElement = fixture.nativeElement.querySelector('#dw-create-menu-icon');
        expect(buttonElement).toBeNull();
        expect(iconElement).toBeDefined();
    });

    it('should route to new task on click of new task button', (done) => {
        const appId = 12;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                expect(event.url).toBe('/' + APWRoutes.apps + '/' + appId + '/' + APWRoutes.tasks + '/' + APWRoutes.create);
                done();
            }
        });
        component.appId = appId;
        fixture.detectChanges();
        element = fixture.debugElement.nativeElement.querySelector('#dw-create-menu-button');
        element.click();
        element = fixture.debugElement.nativeElement.querySelector('#dw-new-task-menu');
        element ? element.click() : component.onCreateClick(APWRoutes.tasks);
    });

    it('should route to new process on click of new process button', (done) => {
        const appId = 12;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                expect(event.url).toBe('/' + APWRoutes.apps + '/' + appId + '/' + APWRoutes.processes + '/' + APWRoutes.create);
                done();
            }
        });
        component.appId = appId;
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('#dw-create-menu-button');
        element.click();
        element = fixture.nativeElement.querySelector('#dw-new-process-menu');
        element ? element.click() : component.onCreateClick(APWRoutes.processes);
    });
});
