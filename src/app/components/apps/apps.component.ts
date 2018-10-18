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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppDefinitionRepresentationModel } from '@alfresco/adf-process-services';
import { AppConfigService } from '@alfresco/adf-core';
import { GlobalVariables } from '../global-values/globals'

@Component({
    selector: 'apw-apps',
    templateUrl: 'apps.component.html',
    styleUrls: ['./apps.component.scss'],
    providers: []
})

export class AppsComponent implements OnInit {

    landingRoutePage: string;
    constructor(private appConfig: AppConfigService, public router: Router, private globalVlaues: GlobalVariables) {
    }

    ngOnInit() {
        this.landingRoutePage = this.appConfig.get('landing-page', 'dashboard/default');
    }

    onAppSelection(app: AppDefinitionRepresentationModel) {
        const appId = app.id ? app.id : 0;
        this.router.navigate([`apps/${appId}/${this.landingRoutePage}`]);
        this.globalVlaues.currentAppId = '' + appId;

    }

}
