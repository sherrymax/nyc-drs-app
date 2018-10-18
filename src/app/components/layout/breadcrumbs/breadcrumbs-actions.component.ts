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

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MediaQueryService } from '../../../services/media-query.service';

@Component({
    selector: 'apw-breadcrumb-actions',
    templateUrl: './breadcrumbs-actions.component.html',
    styleUrls: ['./breadcrumbs-actions.component.scss']
})
export class BreadCrumbsActionsComponent implements OnInit {

    static ACTION_INFO = 'Info';

    mobile = false;

    @Input()
    selectedAction: string;

    @Output()
    infoClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(private mediaQuery: MediaQueryService) { }

    ngOnInit() {
        this.mediaQuery.mobile$.subscribe( (isMobile) => {
            this.mobile = isMobile;
        });
    }

    onInfoClick(): void {
        this.infoClick.emit();
    }

    isInfoActionSelected(): boolean {
        return this.selectedAction === BreadCrumbsActionsComponent.ACTION_INFO ? true : false;
    }
}
