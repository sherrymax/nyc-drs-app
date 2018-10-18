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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { BreadCrumbsEntryComponent } from './breadcrumbs-entry.component';
import { BreadCrumb } from './breadcrumb.model';

describe('BreadCrumbsEntryComponent', () => {
    let component: BreadCrumbsEntryComponent;
    let fixture: ComponentFixture<BreadCrumbsEntryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BreadCrumbsEntryComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BreadCrumbsEntryComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of BreadCrumbsEntryComponent', () => {
        expect(fixture.componentInstance instanceof BreadCrumbsEntryComponent).toBe(true, 'should create BreadCrumbsEntryComponent');
    });

    it('input should be Array Of BreadCrumbs', () => {
        const breadCrumb = new BreadCrumb('101', 'alfresco', 'type');
        component.crumbs = [];
        component.crumbs.push(breadCrumb);
        fixture.detectChanges();
        expect(component.crumbs.length).toBe(1);
        expect(component.crumbs[0]).toBe(breadCrumb);
    });

    it('should emit the crumb name when clicked on it and check the length of breadcrumb', () => {
        const breadCrumb1 = new BreadCrumb('101', 'alfresco', 'type');
        const breadCrumb2 = new BreadCrumb('102', 'dw', 'type');
        component.crumbs = [];
        component.crumbs.push(breadCrumb1);
        component.crumbs.push(breadCrumb2);
        const emitSpy = spyOn(component.onCrumbSelection, 'emit');
        fixture.detectChanges();
        const crumbElement = fixture.nativeElement.querySelectorAll
                                ('.dw-breadcrumb-container > .dw-breadcrumb-entry-container > .dw-crumb-fragment');
        crumbElement[0].click();
        expect(crumbElement[0].innerText).toBe('alfresco');
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should display breadcrumb', () => {
        component.crumbs = [new BreadCrumb('101', 'workspace', 'type'), new BreadCrumb('103', 'Tasks', 'type'),
                              new BreadCrumb('104', 'Running', 'type')];
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelectorAll('#dw-crumb-entry');
        expect(el[0].innerText).toBe('workspace');
        expect(el[1].innerText).toBe('Tasks');
        expect(el[2].innerText).toBe('Running');
    });
});
