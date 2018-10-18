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
import { MatDialogRef } from '@angular/material';
import { DialogEvent } from './models/toolbar-dialog-event';
import { DialogContentModel } from './models/dialog-content.model';


@Component({
    selector: 'apw-dialog-event',
    templateUrl: 'dialog-confirmation.component.html',
    encapsulation: ViewEncapsulation.None
  })
export class DialogConfirmationComponent {

  static DIALOG_ACTION;
  dialogContent: DialogContentModel;
  constructor(public dialogRef: MatDialogRef<DialogConfirmationComponent>) { }
  onClick(key: any) {
    switch (key) {
      case DialogEvent.ACTION_SAVE:
        this.dialogRef.close(new DialogEvent(DialogEvent.ACTION_SAVE));
        break;
      case DialogEvent.ACTION_DISCARD:
        this.dialogRef.close(new DialogEvent(DialogEvent.ACTION_DISCARD));
        break;
      case DialogEvent.ACTION_YES:
        this.dialogRef.close(new DialogEvent(DialogEvent.ACTION_YES));
        break;
      case DialogEvent.ACTION_NO:
        this.dialogRef.close(new DialogEvent(DialogEvent.ACTION_NO));
        break;
    }
  }
}
