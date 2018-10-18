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

import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ProcessFilterService, FilterProcessRepresentationModel } from '@alfresco/adf-process-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AppConfigService } from '@alfresco/adf-core';

export function processFilterServiceFactory(api: AlfrescoApiService) {
    return new ProcessFilterService(api);
}

@Component({
    selector: 'apw-create-process',
    templateUrl: './create-process.component.html',
    styleUrls: ['./create-process.component.scss'],
    providers: [{
        provide: ProcessFilterService,
        useFactory: processFilterServiceFactory,
        deps: [AlfrescoApiService]
    }],
    encapsulation: ViewEncapsulation.None
})
export class CreateProcessComponent implements OnInit, OnDestroy {

    @Input()
    appId: string = null;

    sub: Subscription;
    defaultFilterId = '';

    defaultProcessDefinitionName: string;
    defaultProcessName: string;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private appConfig: AppConfigService,
        private processFilterService: ProcessFilterService) {

    }

    ngOnInit() {
        this.defaultProcessName = this.appConfig.get<string>('adf-start-process.name');
        this.defaultProcessDefinitionName = this.appConfig.get<string>('adf-start-process.processDefinitionName');

        this.sub = this.route.parent.params.subscribe(params => {
            this.appId = params['appId'];
            this.getDefaultProcessFilter(this.getAppId());
        });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    backFromProcessCreation(): void {
        this.router.navigateByUrl('apps/' + this.appId + '/processes/' + this.defaultFilterId);
    }

    getDefaultProcessFilter(appId: string): void {
        this.processFilterService.getProcessFilterByName('Running', +appId).subscribe(
            (res: FilterProcessRepresentationModel) => {
                this.defaultFilterId = res.id.toString();
            }
        );
    }

    getAppId(): string {
        return +this.appId === 0 ? null : this.appId;
    }
}
