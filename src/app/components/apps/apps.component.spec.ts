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
import { AppsComponent } from './apps.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { AppDefinitionRepresentationModel } from '@alfresco/adf-process-services';

describe('AppsComponent', () => {
    let component: AppsComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<AppsComponent>;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppsComponent
                ],
            providers: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppsComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        router = fixture.debugElement.injector.get(Router);
    });

    it('should create instance of AppsComponent', () => {
        expect(fixture.componentInstance instanceof AppsComponent).toBe(true, 'should AppsComponent');
    });

    it('should define adf-apps', () => {
        fixture.detectChanges();
        const adfAppsElement = fixture.debugElement.nativeElement.querySelector('adf-apps');
        expect(adfAppsElement).toBeDefined();
    });

    it('should route to dashboard on click of app', (done) => {
        const appId = 101;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                expect(event.url).toBe('/' + 'apps' + '/' + appId + '/dashboard/default');
                done();
            }
        });
        component.onAppSelection(new AppDefinitionRepresentationModel({id: 101, name: 'fake-name'}));
        fixture.detectChanges();
    });
});
