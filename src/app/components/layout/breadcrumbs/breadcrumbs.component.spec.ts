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
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppsProcessService } from '@alfresco/adf-core';
import { TaskFilterService, ProcessFilterService } from '@alfresco/adf-process-services';

import { BreadCrumbsComponent } from './breadcrumbs.component';
import {
    fakeApp1, defaultFakeProcessFilter,
    fakeProcessFilters, fakeTaskFilters } from '../../../test-mock';

describe('BreadCrumbsComponent', () => {
    let component: BreadCrumbsComponent;
    let fixture: ComponentFixture<BreadCrumbsComponent>;

    const ProcessFilterServiceStub = {
        getProcessFilterById() {
            return Observable.of(defaultFakeProcessFilter);
        },
        getProcessFilterByName() {
            return Observable.of(defaultFakeProcessFilter);
        },
        getProcessFilters() {
            return Observable.of(fakeProcessFilters.data);
        }
    };

    const TaskFilterServiceStub = {
        getTaskListFilters() {
            return Observable.of(fakeTaskFilters.data);
        }
    };

    const AppsProcessServiceStub = {
        getApplicationDetailsById() {
            return Observable.of(fakeApp1);
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BreadCrumbsComponent
            ],
            providers: [
                        {
                            provide: AppsProcessService, useValue: AppsProcessServiceStub
                        },
                        {
                            provide: ProcessFilterService, useValue: ProcessFilterServiceStub
                        },
                        {
                            provide: TaskFilterService, useValue: TaskFilterServiceStub
                        },
                        {
                            provide: ActivatedRoute,
                            useValue: {
                                url: Observable.of([{path: 'processes'}, {path: 1001 }]),
                                params: Observable.of({processFilterId: '123'}),
                                parent: {params: Observable.of({appId: '321'})}
                            }
                        }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BreadCrumbsComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of BreadCrumbsComponent', () => {
        expect(fixture.componentInstance instanceof BreadCrumbsComponent).toBe(true);
    });

    it('should set BreadCrumb', () => {
        component.currentMenu = 'processes';
        component.createBreadCrumbs();
        fixture.detectChanges();
        expect(component.crumbs[2]).not.toBeNull();
        expect(component.crumbs[2].getName()).toBe('DW-BREADCRUMBS.ENTRY-PROCESSES');
        expect(component.crumbs[2].getId()).toBe('processes');

        component.currentMenu = 'dashboard';
        component.createBreadCrumbs();
        fixture.detectChanges();
        expect(component.crumbs[2]).not.toBeNull();
        expect(component.crumbs[2].getName()).toBe('DW-BREADCRUMBS.ENTRY-DASHBOARD');
        expect(component.crumbs[2].getId()).toBe('dashboard');

        component.currentMenu = 'tasks';
        component.filterId = 'new';
        component.createBreadCrumbs();
        fixture.detectChanges();
        expect(component.crumbs[2]).not.toBeNull();
        expect(component.crumbs[3].getName()).toBe('DW-BREADCRUMBS.ENTRY-NEW-TASK');
        expect(component.crumbs[3].getId()).toBe('newtask');
    });
});
