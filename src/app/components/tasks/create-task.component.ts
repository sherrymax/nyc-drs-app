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
import { FilterRepresentationModel, TaskFilterService } from '@alfresco/adf-process-services';
import { AlfrescoApiService, BpmUserService, LogService } from '@alfresco/adf-core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

export function taskFilterServiceFactory(api: AlfrescoApiService, log: LogService) {
    return new TaskFilterService(api, log);
}

export function bpmUserServiceFactory(api: AlfrescoApiService, log: LogService) {
    return new BpmUserService(api, log);
}

@Component({
    selector: 'apw-create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.scss'],
    providers: [{
        provide: TaskFilterService,
        useFactory: taskFilterServiceFactory,
        deps: [AlfrescoApiService, LogService]
    }, {
        provide: BpmUserService,
        useFactory: bpmUserServiceFactory,
        deps: [AlfrescoApiService, LogService]
    }],
    encapsulation: ViewEncapsulation.None
})
export class CreateTaskComponent implements OnInit, OnDestroy {

    static selectedAppName = '';

    @Input()
    appId: string = null;

    sub: Subscription;
    defaultFilterId = '';
    involedFilterId = '';
    currentUserId: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private taskFilterService: TaskFilterService,
                private bpmUserService: BpmUserService) {
    }

    ngOnInit() {
        this.sub = this.route.parent.params.subscribe(params => {
            this.appId = params['appId'];
            this.getDefaultTaskFilter(this.getAppId());
            this.getInvolvedTaskFilter(this.getAppId());
        });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    onStartTask(event: any): void {
        this.bpmUserService.getCurrentUserInfo().subscribe((res) => {
            this.currentUserId = res.id;
            if (this.isTaskAssignedToCurrentUser(event.assignee)) {
                this.redirectTo(this.defaultFilterId);
            } else {
                this.redirectTo(this.involedFilterId);
            }
        });
    }

    private isTaskAssignedToCurrentUser(assignee: any): boolean {
        return !assignee || assignee.id === this.currentUserId;
    }

    private redirectTo(filterId: any): void {
        this.router.navigateByUrl('apps/' + this.appId + '/tasks/' + filterId);
    }

    getAppId(): string {
        return +this.appId === 0 ? null : this.appId;
    }

    onStartTaskCancel(): void {
        this.router.navigateByUrl('apps/' + this.appId + '/tasks/' + this.defaultFilterId);
    }

    getDefaultTaskFilter(appId: string): void {
        this.taskFilterService.getTaskFilterByName('My Tasks', +appId).subscribe(
            (res: FilterRepresentationModel) => {
                this.defaultFilterId = res.id.toString();
            }
        );
    }

    getInvolvedTaskFilter(appId: string): void {
        this.taskFilterService.getTaskFilterByName('Involved Tasks', +appId).subscribe(
            (res: FilterRepresentationModel) => {
                this.involedFilterId = res.id.toString();
            }
        );
    }
}
