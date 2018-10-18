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

import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { LogService, TranslationService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material';
import { ToolbarIconEvent } from './models/toolbar-icon-event';
import { MediaQueryService } from '../../../services/media-query.service';
import { DialogConfirmationComponent } from './dialog-confirmation.component';
import { DialogEvent } from './models/toolbar-dialog-event';
import { DialogContentModel } from './models/dialog-content.model';

@Component({
    selector: 'apw-process-toolbar',
    templateUrl: './process-toolbar.component.html',
    styleUrls: ['./process-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessToolbarComponent implements OnInit {

    @Input()
    selectedAction: string;

    @Input()
    appName: string;

    @Input()
    id: string;

    @Input()
    name: string;

    @Input()
    fileName: string;

    @Input()
    disableButton: boolean;

    @Output()
    iconClick: EventEmitter<ToolbarIconEvent> = new EventEmitter<ToolbarIconEvent>();

    @Output()
    clicked: EventEmitter<any> = new EventEmitter<any>();

    auditDownload = true;

    mobile = false;

    constructor(private logService: LogService,
                private mediaQuery: MediaQueryService,
                public dialog: MatDialog,
                private translateService: TranslationService) {

    }

    ngOnInit() {
        this.mediaQuery.mobile$.subscribe( (isMobile) => {
            this.mobile = isMobile;
        });
    }

    onBackButtonClick(): void {
        this.iconClick.emit(new ToolbarIconEvent(ToolbarIconEvent.ACTION_BACK_TYPE));
    }

    onCloseIconClick(): void {
        this.iconClick.emit(new ToolbarIconEvent(ToolbarIconEvent.ACTION_CLOSE_TYPE));
    }

    cancelProcess() {
        this.iconClick.emit(new ToolbarIconEvent(ToolbarIconEvent.ACTION_CANCEL_TYPE));
    }

    onInfoClick(): void {
        if (this.isInfoActionSelected()) {
            this.selectedAction = '';
        } else {
            this.selectedAction = ToolbarIconEvent.ACTION_INFO_TYPE;
        }
        this.iconClick.emit(new ToolbarIconEvent(ToolbarIconEvent.ACTION_INFO_TYPE));
    }

    displayProcessName(): string {
      return this.name;
    }

    displayAppName() {
        return ' in ' + this.appName;
    }

    onAuditError(event: any): void {
        this.logService.error(event);
    }

    isInfoActionSelected(): boolean {
        return this.selectedAction.toLocaleUpperCase() === ToolbarIconEvent.ACTION_INFO_TYPE.toLocaleUpperCase() ? true : false;
    }

    onCancelIconClick() {
        const dialogRef = this.dialog.open(DialogConfirmationComponent);
        dialogRef.componentInstance.dialogContent = this.buildDialogContent();
        dialogRef.afterClosed().subscribe(res => {
            if (res && res.action === DialogEvent.ACTION_YES) {
                this.cancelProcess();
            }
        });
    }

    buildDialogContent() {
        const content = {
            'title': this.translateService.instant('DW-DIALOG.PROCESS-DIALOG.TITLE'),
            'subTitle': this.translateService.instant('DW-DIALOG.PROCESS-DIALOG.SUB-TITLE'),
            'actions': [
                {
                    'label': this.translateService.instant('DW-DIALOG.PROCESS-DIALOG.ACTION-YES'),
                    'key': 'yes',
                    'color': 'primary'
                },
                {
                    'label': this.translateService.instant('DW-DIALOG.PROCESS-DIALOG.ACTION-NO'),
                    'key': 'no'
                }
            ]
        };
        return <DialogContentModel>content;
    }

    onAuditClick(event: any): void {
        this.clicked.emit(event);
    }
}
