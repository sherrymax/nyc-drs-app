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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { UploadService } from '@alfresco/adf-core';
import { ProcessAttachmentComponent } from './process-attachment.component';
import { ProcessUploadService } from '@alfresco/adf-process-services';
import { fakeProcessInstance, fakeRunningProcessInstance, mockPdfData } from '../../test-mock';
import { ContentLinkModel, ProcessContentService } from '@alfresco/adf-core';

describe('ProcessAttachmentComponent', () => {

    let component: ProcessAttachmentComponent;
    let fixture: ComponentFixture<ProcessAttachmentComponent>;
    let uploadServie: UploadService;
    let mockAttachment: any;
    let fileUploadCompleteSpy: jasmine.Spy;

    function createFakePdfBlob(): Blob {
        const pdfData = mockPdfData;
        return new Blob([pdfData], { type: 'application/pdf' });
    }

    mockAttachment = {
        size: 2,
        total: 2,
        start: 0,
        data: [
            {
                id: 8,
                name: 'fake.zip',
                created: 1494595697381,
                createdBy: { id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com' },
                relatedContent: true,
                contentAvailable: true,
                link: false,
                mimeType: 'application/zip',
                simpleType: 'content',
                previewStatus: 'unsupported',
                thumbnailStatus: 'unsupported'
            },
            {
                id: 9,
                name: 'fake.jpg',
                created: 1494595655381,
                createdBy: { id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com' },
                relatedContent: true,
                contentAvailable: true,
                link: false,
                mimeType: 'image/jpeg',
                simpleType: 'image',
                previewStatus: 'unsupported',
                thumbnailStatus: 'unsupported'
            }
        ]
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProcessAttachmentComponent
            ],
            providers: [
                ProcessUploadService,
                UploadService,
                ProcessContentService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessAttachmentComponent);
        component = fixture.componentInstance;
        uploadServie = fixture.debugElement.injector.get(UploadService);
        fileUploadCompleteSpy = spyOn(uploadServie, 'fileUploadComplete').and.returnValue(Observable.of());
        component.processInstanceDetails = fakeRunningProcessInstance;
        fixture.detectChanges();
    });

    it('should create instance of CreateProcessComponent', () => {
        expect(fixture.componentInstance instanceof ProcessAttachmentComponent).toBe(true);
    });

    it('should define adf-upload-drag-area', () => {
        fixture.detectChanges();
        const adfUploadDragAarea = fixture.debugElement.nativeElement.querySelector('adf-upload-drag-area');
        expect(adfUploadDragAarea).toBeDefined();
    });

    it('should define adf-task-attachment-list', () => {
        fixture.detectChanges();
        const adfTaskAattachmentList = fixture.debugElement.nativeElement.querySelector('adf-task-attachment-list');
        expect(adfTaskAattachmentList).toBeDefined();
    });

    it('should define adf-create-task-attachment', () => {
        component.processInstanceDetails = fakeRunningProcessInstance;
        fixture.detectChanges();
        const adfCreateTaskAttachment = fixture.debugElement.nativeElement.querySelector('#dw-create-attachment-id');
        expect(adfCreateTaskAttachment).toBeDefined();
        expect(adfCreateTaskAttachment).not.toBeNull();
    });

    it('should not show adf-create-task-attachment if the process is completed', () => {
        component.processInstanceDetails = fakeProcessInstance;
        fixture.detectChanges();
        const adfCreateTaskAttachment = fixture.debugElement.nativeElement.querySelector('#dw-create-attachment-id');
        expect(adfCreateTaskAttachment).toBeNull();
    });

    it('should define adf-viewer and adf-viewer-more-actions', () => {
        const pdfBlob = createFakePdfBlob();
        const contentLinkModelMock = new ContentLinkModel({
            id: 4004,
            name: 'FakeBlob.pdf',
            created: 1490354907883,
            createdBy: {
                id: 2,
                firstName: 'dasdas', 'lastName': 'dasads', 'email': 'administrator@admin.com'
            },
            relatedContent: false,
            contentAvailable: true,
            link: false,
            mimeType: 'application/pdf',
            simpleType: 'pdf',
            previewStatus: 'created',
            thumbnailStatus: 'created'
        });
        contentLinkModelMock.contentBlob = pdfBlob;
        component.onAttachmentClick(contentLinkModelMock);
        fixture.detectChanges();
        const adfViewerElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-id');
        const adfViewerMoreActionElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-more-action-id');
        const adfViewerdisplayName = fixture.debugElement.nativeElement.querySelector('#adf-viewer-display-name');
        expect(adfViewerElement).toBeDefined();
        expect(adfViewerMoreActionElement).toBeDefined();
        expect(adfViewerElement).not.toBeNull();
        expect(adfViewerdisplayName.innerText).toBe('FakeBlob.pdf');
    });

    it('should not define adf-viewer and adf-viewer-more-actions when the contentblob is empty', () => {
        fixture.detectChanges();
        const adfViewerElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-id');
        const adfViewerMoreActionElement = fixture.debugElement.nativeElement.querySelector('#dw-viewer-more-action-id');
        const adfViewerdisplayName = fixture.debugElement.nativeElement.querySelector('#adf-viewer-display-name');
        expect(adfViewerMoreActionElement).toBeNull();
        expect(adfViewerElement).toBeNull();
        expect(adfViewerdisplayName).toBeNull();
    });

    it('should show drag and drop template if there is no documents', () => {
        component.processInstanceDetails = fakeRunningProcessInstance;
        fixture.detectChanges();
        const adfEmptyListHeader = fixture.debugElement.nativeElement.querySelector('#adf-empty-list-header-id');
        const adfEmptyListBody = fixture.debugElement.nativeElement.querySelector('#adf-empty-list-body-id');
        const adfEmptyListDrag = fixture.debugElement.nativeElement.querySelector('#adf-empty-list-body-drag-drop-id');
        expect(adfEmptyListBody).toBeDefined();
        expect(adfEmptyListBody).not.toBeNull();
        expect(adfEmptyListHeader.innerText).toContain('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.HEADER');
        expect(adfEmptyListDrag.innerText).toContain('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.DRAG-AND-DROP.TITLE');
    });

    it('should not show drag and drop template if the task is completed', () => {
        component.processInstanceDetails = fakeProcessInstance;
        fixture.detectChanges();
        const adfEmptyListHeader = fixture.debugElement.nativeElement.querySelector('.adf-empty-list-header');
        const adfEmptyListBody = fixture.debugElement.nativeElement.querySelector('#adf-empty-list-body-id');
        expect(adfEmptyListBody).toBeNull();
        expect(adfEmptyListHeader).toBeNull();
    });
});
