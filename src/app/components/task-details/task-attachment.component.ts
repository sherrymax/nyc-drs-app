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

import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { TaskDetailsModel, TaskAttachmentListComponent, TaskUploadService } from '@alfresco/adf-process-services';
import { UploadService, ContentLinkModel, AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';

import { MediaQueryService } from '../../services/media-query.service';

export function taskUploadServiceFactory(api: AlfrescoApiService, config: AppConfigService) {
    return new TaskUploadService(api, config);
}

@Component({
    selector: 'apw-task-attachment',
    templateUrl: './task-attachment.component.html',
    styleUrls: ['./task-attachment.component.scss'],
    providers: [
        {
        provide: UploadService,
        useFactory: (taskUploadServiceFactory),
        deps: [AlfrescoApiService, AppConfigService]
        }
    ],
    encapsulation: ViewEncapsulation.None
})

export class TaskAttachmentComponent implements OnInit {

    @ViewChild('taskAttachmentList')
    taskAttachList: TaskAttachmentListComponent;

    @Input()
    appId: number;

    @Input()
    taskDetails: TaskDetailsModel;

    @Input()
    emptyListImageUrl = './resources/images/empty_doc_lib.svg';

    @Output()
    contentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    mobile = false;

    constructor(
        private uploadService: UploadService,
        private mediaQuery: MediaQueryService) {}

    ngOnInit() {
        this.uploadService.fileUploadComplete.subscribe(value => this.onUploadSuccess());
        this.mediaQuery.mobile$.subscribe( (isMobile) => {
            this.mobile = isMobile;
        });
    }

    isCompletedTask(): boolean {
        return !!this.taskDetails.endDate;
    }

    onAttachmentClick(content: any): void {
        this.contentClicked.emit(content);
    }

    onSingleClick(event: any): void {
        if (this.mobile) {
            this.taskAttachList.emitDocumentContent(event.detail.value.obj);
        }
    }

    showCreateAttachButton(): boolean {
        return !this.isCompletedTask();
    }

    onUploadSuccess(): void {
        this.taskAttachList.reload();
    }
}
