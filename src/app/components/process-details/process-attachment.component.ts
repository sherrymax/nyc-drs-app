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

import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { ProcessInstance, ProcessAttachmentListComponent, ProcessUploadService } from '@alfresco/adf-process-services';
import { UploadService,
         ProcessContentService,
         ContentService,
         LogService,
         AlfrescoApiService,
         AppConfigService
        } from '@alfresco/adf-core';

import { MediaQueryService } from '../../services/media-query.service';

export function processUploadServiceFactory(api: AlfrescoApiService, config: AppConfigService) {
    return new ProcessUploadService(api, config);
}

@Component({
    selector: 'apw-process-attachment',
    templateUrl: './process-attachment.component.html',
    styleUrls: ['./process-attachment.component.scss'],
    providers: [
        {
        provide: UploadService,
        useFactory: (processUploadServiceFactory),
        deps: [AlfrescoApiService, AppConfigService]
        }
    ],
    encapsulation: ViewEncapsulation.None
})

export class ProcessAttachmentComponent implements OnInit {

    @ViewChild('processAttachmentList')
    processAttachList: ProcessAttachmentListComponent;

    @Input()
    appId: number;

    @Input()
    processInstanceDetails: ProcessInstance;

    @Input()
    emptyListImageUrl = './resources/images/empty_doc_lib.svg';

    mobile = false;
    showViewer = false;
    attachmentDetails: any = {};

    constructor(
        private uploadService: UploadService,
        private mediaQuery: MediaQueryService,
        private activitiContentService: ProcessContentService,
        private contentService: ContentService,
        private logService: LogService) { }

    ngOnInit() {
        this.uploadService.fileUploadComplete.subscribe(value => this.onUploadSuccess());
        this.mediaQuery.mobile$.subscribe( (isMobile) => {
            this.mobile = isMobile;
        });
    }

    isCompletedProcess(): boolean {
        return !!this.processInstanceDetails.ended;
    }

    onAttachmentClick(attachmentDetails: any): void {
        this.showViewer = true;
        this.attachmentDetails = attachmentDetails;
    }

    onSingleClick(event: any): void {
        if (this.mobile) {
            this.processAttachList.emitDocumentContent(event.detail.value.obj);
        }
    }

    showCreateAttachButton(): boolean {
        return !this.isCompletedProcess();
    }

    onUploadSuccess() {
        this.processAttachList.reload();
    }

    downloadContent(): void {
        this.activitiContentService.getFileRawContent(this.attachmentDetails.id).subscribe(
            (blob: Blob) => this.contentService.downloadBlob(blob, this.attachmentDetails.name),
            (err) => {
                this.logService.error(err);
            }
        );
    }
}
