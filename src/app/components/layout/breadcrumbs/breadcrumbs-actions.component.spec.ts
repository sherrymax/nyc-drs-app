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

import { BreadCrumbsActionsComponent } from './breadcrumbs-actions.component';

describe('BreadCrumbsActionsComponent', () => {
    let component: BreadCrumbsActionsComponent;
    let fixture: ComponentFixture<BreadCrumbsActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BreadCrumbsActionsComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BreadCrumbsActionsComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of BreadCrumbsActionComponent', () => {
        expect(fixture.componentInstance instanceof BreadCrumbsActionsComponent).toBe(true);
    });

    it('should emit infoClick on click of info icon', () => {
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('mat-icon');
        const emitSpy = spyOn(component.infoClick, 'emit');
        el.click();
        expect(component.infoClick.emit).not.toBeNull();
        expect(emitSpy).toHaveBeenCalled();
    });
});
