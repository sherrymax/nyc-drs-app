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
import { Router } from '@angular/router';
import { AuthenticationService, AppConfigService, LogService } from '@alfresco/adf-core';

@Component({
    selector: 'apw-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

    static DEFAULT_PATH_LOGO = './assets/nycdrs-logo.png';

    constructor(private authService: AuthenticationService,
                private logService: LogService,
                private appConfig: AppConfigService,
                private router: Router) {
    }

    onUserMenuSelect(menuName: string): void {
        if (menuName === 'sign_out') {
            this.onLogout();
        }
    }

    onLogout(): void {
        this.authService.logout()
            .subscribe(
            () => {
                localStorage.setItem('user_role', '');
                this.navigateToLogin();
            },
            (error: any) => {
                if (error && error.response && error.response.status === 401) {
                    this.navigateToLogin();
                } else {
                    this.logService.error('An unknown error occurred while logging out', error);
                    this.navigateToLogin();
                }
            }
            );
    }

    private navigateToLogin(): void {
        this.router.navigate(['/login']);
    }

    getPathLogo() {
        return this.appConfig.get('path-logo', HeaderComponent. DEFAULT_PATH_LOGO);
    }
}
