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
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ProcessFilterService } from '@alfresco/adf-process-services';

import { fakeProcessFilter } from '../../test-mock/app-details.mock';
import { CreateProcessComponent } from './create-process.component';

describe('CreateProcessComponent', () => {

    let component: CreateProcessComponent;
    let fixture: ComponentFixture<CreateProcessComponent>;
    let processFilterService: ProcessFilterService;
    let getProcessFilterByName: jasmine.Spy;
    let router: Router;

    const dummyDwRouterName = {
        apps: 'apps',
        processes: 'processes'
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CreateProcessComponent
            ],
            providers: [
                ProcessFilterService,
                {
                provide: ActivatedRoute,
                    useValue: {
                        parent: {params: Observable.of({appId: 123})}
                    }
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateProcessComponent);
        component = fixture.componentInstance;
        router = fixture.debugElement.injector.get(Router);
        processFilterService = fixture.debugElement.injector.get(ProcessFilterService);
        getProcessFilterByName = spyOn(processFilterService, 'getProcessFilterByName').and.returnValue(Observable.of(fakeProcessFilter));
        fixture.detectChanges();
    });

    it('should create instance of CreateProcessComponent', () => {
        expect(fixture.componentInstance instanceof CreateProcessComponent).toBe(true);
    });

    it('should fetch default process filter by FilterName', () => {
        component.getDefaultProcessFilter(component.appId);
        fixture.detectChanges();
        expect(getProcessFilterByName).toHaveBeenCalled();
        expect(component.defaultFilterId).toBe('65');
    });

    it('should define adfStartProcess', () => {
        fixture.detectChanges();
        const adfStartTask = fixture.nativeElement.querySelector('adf-start-process');
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

    it('should route to running filter on click of start process/cancel button', (done) => {
        const appId = '123';
        const myProcessFilterId = 65;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                expect(event.url).toBe
                ('/' + dummyDwRouterName.apps + '/' + appId + '/' + dummyDwRouterName.processes + '/' + myProcessFilterId);
                done();
            }
        });
        fixture.detectChanges();
        component.backFromProcessCreation();
    });
});
