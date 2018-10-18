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
import { AppConfigService, StorageService } from '@alfresco/adf-core';

@Component({
    selector: 'apw-providers',
    templateUrl: './providers.component.html',
    styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {

    providers = 'BPM';
    isECM = false;

    constructor(
        private storage: StorageService,
        private appConfig: AppConfigService) {
    }

    ngOnInit() {
        if (this.storage.hasItem('providers')) {
            this.providers = this.storage.getItem('providers');
        } else {
            this.providers = this.appConfig.get('adf-login.providers', this.providers);
        }

        this.initProviders();
    }

    private initProviders(): void {
        if (this.providers === 'ALL') {
            this.isECM = true;
        }
    }

    toggleECM(): void {
        this.isECM = !this.isECM;
    }


    private updateProvider(): void {
        if (this.isECM) {
            this.providers = 'ALL';
        } else {
            this.providers = 'BPM';
        }
        this.storage.setItem('providers', this.providers);
    }

    onBackClick(): void {
        window.history.back();
    }

    onApplyClick(): void {
        this.updateProvider();
        window.location.href = '/';
    }
}
