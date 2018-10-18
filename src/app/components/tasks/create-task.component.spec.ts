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
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { BpmUserService } from '@alfresco/adf-core';
import { TaskFilterService } from '@alfresco/adf-process-services';

import { CreateTaskComponent } from './create-task.component';
import { taskDetailsMock, fakeTaskFilter  } from '../../test-mock';

describe('CreateTaskComponent', () => {

    let component: CreateTaskComponent;
    let fixture: ComponentFixture<CreateTaskComponent>;
    let router: Router;
    let taskFilterService: TaskFilterService;
    let bpmUserService: BpmUserService;
    let getTaskFilterByNameSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;

    const fakeBpmUser = {
        id: 1234,
        apps: [],
        capabilities: null,
        company: 'fake-company',
        email: 'fakeBpm@fake.com',
        firstName: 'fake-bpm-first-name',
        lastName: 'fake-bpm-last-name',
        fullname: 'fake-bpm-full-name',
        groups: []
    };

    const dummyDwRouterName = {
        apps: 'apps',
        tasks: 'tasks'
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CreateTaskComponent
            ],
            providers: [
                TaskFilterService,
                BpmUserService,
                {
                provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({taskFilterId: 'fakeFilterId'}),
                        parent: {params: Observable.of({appId: '123'})}
                    }
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateTaskComponent);
        component = fixture.componentInstance;
        router = fixture.debugElement.injector.get(Router);
        taskFilterService = fixture.debugElement.injector.get(TaskFilterService);
        bpmUserService = fixture.debugElement.injector.get(BpmUserService);
        getTaskFilterByNameSpy = spyOn(taskFilterService, 'getTaskFilterByName').and.returnValue(Observable.of(fakeTaskFilter));
        getCurrentUserInfoSpy = spyOn(bpmUserService, 'getCurrentUserInfo').and.returnValue(Observable.of(fakeBpmUser));

        component.appId = '1001';
        fixture.detectChanges();
    });

    it('should create instance of CreateTaskComponent', () => {
        expect(component instanceof CreateTaskComponent).toBe(true, 'should create CreateTaskComponent');
    });

    it('should fetch default task filter by FilterName', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getTaskFilterByNameSpy).toHaveBeenCalled();
            expect(component.defaultFilterId).toBe('111');
        });
    }));

    it('should fetch current logged in user', async(() => {
        component.onStartTask(fakeBpmUser);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getCurrentUserInfoSpy).toHaveBeenCalled();
            expect(component.currentUserId).toBe(1234);
        });
    }));

    it('should define adfStartTask', () => {
        fixture.detectChanges();
        const adfStartTask = fixture.nativeElement.querySelector('adf-start-task');
        expect(adfStartTask).toBeDefined();
    });

    it('should define adf-toolbar', () => {
        fixture.detectChanges();
        const adfToolbarTitle = fixture.nativeElement.querySelector('adf-toolbar-title');
        const adfToolbar = fixture.nativeElement.querySelector('adf-toolbar');
        expect(adfToolbar).toBeDefined();
        expect(adfToolbarTitle).toBeDefined();
    });

    it('should define breadcrumb', () => {
        fixture.detectChanges();
        const breadCrumbContainer = fixture.nativeElement.querySelector('apw-breadcrumbs');
        expect(breadCrumbContainer).toBeDefined();
    });

    it('should route to mytask filter on click of start task cancel button', (done) => {
        const appId = '123';
        const myTaskFilterID = 111;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                expect(event.url).toBe('/' + dummyDwRouterName.apps + '/' + appId + '/' + dummyDwRouterName.tasks + '/' + myTaskFilterID);
                done();
            }
        });
        fixture.detectChanges();
        component.onStartTaskCancel();
    });

    it('should route to involvedTask filter if task assigne to some one', (done) => {
        const appId = '123';
        const involvedFilterId = 111;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                expect(event.url).toBe('/' + dummyDwRouterName.apps + '/' + appId + '/' + dummyDwRouterName.tasks + '/' + involvedFilterId);
                done();
            }
        });
        fixture.detectChanges();
        component.onStartTask(taskDetailsMock);
    });

    it('should route to MyTask filter if task assigne to same user', (done) => {
        const appId = '123';
        const defaultFilterId = 111;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                expect(event.url).toBe('/' + dummyDwRouterName.apps + '/' + appId + '/' + dummyDwRouterName.tasks + '/' + defaultFilterId);
                done();
            }
        });
        fixture.detectChanges();
        component.onStartTask(taskDetailsMock);
    });
});
