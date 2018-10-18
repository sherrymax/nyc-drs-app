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

import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { AppConfigService, LogService, StorageService, BpmUserService } from '@alfresco/adf-core';
import { GlobalVariables } from '../global-values/globals'

@Component({
    selector: 'apw-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    @ViewChild('alfrescologin')
    alfrescologin: any;

    providers = 'ALL'; //this has to be dynamically read from app.config.json file.
    customValidation: any;
    myCustomLogo = './nycdrs-logo.png';

    disableCsrf = false;
    customMinLength = 2;

    copyrightText = '\u00A9 2018 Alfresco Software, Inc. All Rights Reserved.';

    constructor(private router: Router,
        private storage: StorageService,
        private bpmUserService: BpmUserService,
        private logService: LogService,
        private appConfig: AppConfigService,
        private globalValues: GlobalVariables) {

        this.customValidation = {
            username: ['', Validators.compose([
                Validators.required,
                Validators.minLength(this.customMinLength)
            ])],
            password: ['', Validators.required]
        };
    }

    ngOnInit() {
        this.copyrightText = this.appConfig.get<string>('adf-login.copyrightText', this.copyrightText);
        this.alfrescologin.addCustomValidationError('username', 'required', 'LOGIN.MESSAGES.USERNAME-REQUIRED');
        this.alfrescologin.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN',
            { minLength: this.customMinLength });
        this.alfrescologin.addCustomValidationError('password', 'required', 'LOGIN.MESSAGES.PASSWORD-REQUIRED');

        this.initProviders();
    }

    initProviders() {
        if (this.storage.hasItem('providers')) {
            this.providers = this.storage.getItem('providers');
        } else {
            this.providers = this.appConfig.get('adf-login.providers', this.providers);
            this.storage.setItem('providers', this.providers);
        }
    }

    onLogin($event) {
        this.bpmUserService.getCurrentUserInfo().subscribe((res) => {
            console.dir(res);
            this.globalValues.loggedInUser.id = res.id;
            this.globalValues.loggedInUser.firstName = res.firstName;
            this.globalValues.loggedInUser.groups = res.groups;

            for(var i=0; i<res.groups.length; i++){
                this.globalValues.rolesOfLoggedUser[this.globalValues.rolesOfLoggedUser.length] = res.groups[i].name;
            }

        });

        // Routing mnodified - Sherry - 10/16/2018 - START
        //this.router.navigate(['/']);   
        
        let appId = 0; //Temporarily hardcoded
        this.router.navigate([`apps/${appId}/user-portal`]);
        // Routing mnodified - Sherry - 10/16/2018 - END


    }

    onError($event) {
        this.logService.error($event);
    }

    validateForm($event) {

    }

}
