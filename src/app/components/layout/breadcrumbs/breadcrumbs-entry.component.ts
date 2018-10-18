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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BreadCrumb } from './breadcrumb.model';

@Component({
    selector: 'apw-dashboard-breadcrumbs-entry',
    templateUrl: './breadcrumbs-entry.component.html',
    styleUrls: ['./breadcrumbs-entry.component.scss']
})

export class BreadCrumbsEntryComponent {

    @Input()
    crumbs: BreadCrumb[];

    @Output()
    onCrumbSelection: EventEmitter<BreadCrumb> = new EventEmitter<BreadCrumb>();

    constructor() {

    }

    moveToCrumb(crumb: BreadCrumb, last: boolean): void {
        if (!last) {
            this.onCrumbSelection.emit(crumb);
        }
    }
}
