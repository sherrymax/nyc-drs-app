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

import { Component, ViewEncapsulation } from '@angular/core';
import { PageTitleService } from '@alfresco/adf-core';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
    selector: 'apw-app-root',
    template: `<router-outlet></router-outlet>`,
    encapsulation: ViewEncapsulation.None
})
export class AppRootComponent {

    static LOGIN_URL = '/#/login';

    constructor(pageTitleService: PageTitleService, alfrescoApiService: AlfrescoApiService) {
        pageTitleService.setTitle();
        alfrescoApiService.getInstance().on('error', (error) => {
            this.handleUnauthorizedError(error);
        });
    }

    private handleUnauthorizedError(error) {
        if ( error && error.status === 401 ) {
            window.location.href = AppRootComponent.LOGIN_URL;
        }
    }
}
