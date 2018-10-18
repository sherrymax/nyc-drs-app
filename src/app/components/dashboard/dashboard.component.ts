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

import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MediaQueryService } from '../../services/media-query.service';

@Component({
    selector: 'apw-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
    static ACTION_INFO = 'Info';
    static SIDEBAR_WIDTH_MAX = '350px';
    static SIDEBAR_WIDTH_MIN = '0px';

    reportQuery: any;
    appId: string;
    private routeSub: Subscription;

    showSidebar = true;
    mobile = false;
    sideBarWidth: string;

    constructor(private mediaQuery: MediaQueryService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.routeSub = this.route.parent.params.subscribe(params => {
            this.appId = params['appId'];
        });

        this.mediaQuery.mobile$.subscribe( (isMobile) => {
            this.mobile = isMobile;
            if (this.mobile) {
                this.showSidebar = false;
            }
            this.calculateMainContentPercentage();
        });
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }

    toggleDashboardSettings(): void {
        this.showSidebar = !this.showSidebar;
        this.calculateMainContentPercentage();
    }

    calculateMainContentPercentage() {
        this.sideBarWidth =  this.showSidebar ? DashboardComponent.SIDEBAR_WIDTH_MAX : DashboardComponent.SIDEBAR_WIDTH_MIN;
    }

    onParameterChange(reportParam): void {
        this.reportQuery = reportParam;
    }

    getBreadcrumbActionName(): string {
        return this.showSidebar ? DashboardComponent.ACTION_INFO : '';
    }
}
