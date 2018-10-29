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

import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    Output,
    EventEmitter,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import {
    AlfrescoApiService,
    LogService,
    UploadService,
    FormOutcomeEvent,
    FormModel,
    BpmUserService,
    ContentLinkModel,
    FormRenderingService,
    AppConfigService
} from '@alfresco/adf-core';
import {
    TaskListService,
    TaskDetailsModel,
    ProcessUploadService,
    AttachFileWidgetComponent,
    AttachFolderWidgetComponent,
    ProcessInstanceVariable,
    ProcessService
} from '@alfresco/adf-process-services';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService, FormFieldEvent } from '@alfresco/adf-core';
import { bpmUserServiceFactory } from '../tasks';
import { CommentComponent } from '../comment/comment.component';
import { GlobalVariables } from '../global-values/globals';

@Component({
    selector: 'apw-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
    providers: [{
        provide: BpmUserService,
        useFactory: bpmUserServiceFactory,
        deps: [AlfrescoApiService, LogService]
    },
    { provide: UploadService, useClass: ProcessUploadService },
    ],
    encapsulation: ViewEncapsulation.None
})

export class TaskFromComponent implements OnInit, OnDestroy {

    @Input()
    taskDetails: TaskDetailsModel;

    @Input()
    readOnlyForm = false;

    @Output()
    navigate: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    complete: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    executeNoFormOutcome: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    taskFormName: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    contentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    @Output()
    formOutcomeExecute: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    @Output()
    formChange: EventEmitter<any> = new EventEmitter<any>();


    appId;
    taskId: string;


    showInfoDrawer: boolean;
    attachmentDetails: any = {};

    taskFormValues: string;

    noTaskDetailsTemplateComponent: TemplateRef<any>;

    sub: Subscription;
    private currentUserId: number;
    private currentUserFirstName: string;

    processVariables: ProcessInstanceVariable[];

    constructor(private taskListService: TaskListService,
                private logService: LogService,
                private route: ActivatedRoute,
                private router: Router,
                private bpmUserService: BpmUserService,
                private formRenderingService: FormRenderingService,
                private formService: FormService,
                private globalValues: GlobalVariables,
                private appConfig: AppConfigService,
                private processService: ProcessService

) {
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('select-folder', () => AttachFolderWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('comment', () => CommentComponent, true);

    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.appId = params['appId'];
            this.taskId = params['taskId'];
        });
        this.loadCurrentUser();
        console.log(this.globalValues.loggedInUser.groups);
        this.updateProcessValues();

        // setTimeout(() => {
        //     this.delayedUpdateProcessValues();
        // }, 500);
    }

    updateProcessValues(){
        this.processVariables = [];
        let userRole = this.appConfig.get<string>('user-role-to-attach-documents');
        let userRoleValue = 'false';
        if(this.globalValues && this.globalValues.loggedInUser && this.globalValues.loggedInUser.groups){
            userRoleValue = ''+(this.globalValues.loggedInUser.groups.indexOf(userRole) != -1);
        }

        this.processVariables.push({ name: 'userHasPermissionToAttachDocs', value: userRoleValue, type: 'string' });
        console.log('User First Name = ',this.globalValues.loggedInUser.firstName);
        this.processVariables.push({ name: 'owner', value: this.globalValues.loggedInUser.firstName, type: 'string' });
        this.processVariables.push({ name: 'rolesOfLoggedUser', value: this.globalValues.rolesOfLoggedUser.join(','), type: 'string' });
        
        this.processService.createOrUpdateProcessInstanceVariables(this.globalValues.currentProcessInstanceId, this.processVariables);
    }

    delayedUpdateProcessValues(){
        this.processVariables = [];
        console.log('User First Name = ',this.currentUserFirstName);
        this.processVariables.push({ name: 'owner', value: this.currentUserFirstName, type: 'string' });
        this.processService.createOrUpdateProcessInstanceVariables(this.globalValues.currentProcessInstanceId, this.processVariables);
    }


    hasFormKey() {
        return !!this.taskDetails.formKey;
    }

    isTaskLoaded(): boolean {
        return !!this.taskDetails;
    }

    onFormCompleted(form: FormModel) {
        const processInfo = {
            processInstanceId: this.taskDetails.processInstanceId,
            processDefinitionId: this.taskDetails.processDefinitionId
        };
        this.complete.emit(processInfo);
    }

    onFormLoaded(form: FormModel): void {
        this.taskFormValues = JSON.stringify(form.values);
        const formName = (form && form.name ? form.name : null);
        this.taskFormName.emit(formName);
        this.onFormChange();
    }

    onFormContentClick(content: ContentLinkModel): void {
        this.contentClicked.emit(content);
    }

    isCompletedTask(): boolean {
        return this.taskDetails && this.taskDetails.endDate !== undefined && this.taskDetails.endDate !== null;
    }

    hasCompleteButton(): boolean {
        return !this.isCompletedTask() && this.isAssignedToCurrentUser();
    }

    onCompleteTask(): void {
        this.taskListService.completeTask(this.taskDetails.id)
            .subscribe(
                (res) => {
                    // this.router.navigate([`apps/${this.appId}/user-portal`]);
                    this.navigate.emit();
                    this.executeNoFormOutcome.emit();
                    this.route
                },
                error => {
                    this.logService.error('Task form' + error);
                }
            );
    }

    private loadCurrentUser(): void {
        this.bpmUserService.getCurrentUserInfo().subscribe((res) => {
            this.currentUserId = res && res.id;
            this.currentUserFirstName = res && res.firstName;
        });
    }

    isAssignedToCurrentUser(): boolean {
        return +this.currentUserId === (this.taskDetails.assignee && this.taskDetails.assignee.id);
    }

    canInitiatorComplete(): boolean {
        return this.taskDetails.initiatorCanCompleteTask;
    }

    isReadOnlyForm(): boolean {
        return this.readOnlyForm || !(this.isAssignedToCurrentUser() || this.canInitiatorComplete());
    }

    isProcessInitiator(): boolean {
        return this.currentUserId === +this.taskDetails.processInstanceStartUserId;
    }

    isSaveButtonVisible(): boolean {
        return false;
        //return this.isAssignedToCurrentUser() || (!this.canInitiatorComplete() && !this.isProcessInitiator());
    }

    isCompleteButtonVisible(): boolean {
        return false;
    }

    getTaskName(): any {
        return { taskName: this.taskDetails.name };
    }

    onCancelButtonClick() {
        this.cancel.emit();
    }

    onFormOutcomeExecute(formOutcomeEvent: FormOutcomeEvent) {
        let taskName  = formOutcomeEvent['_outcome']['form']['taskName'];
        let outcome = formOutcomeEvent['_outcome']['name'];

        this.formOutcomeExecute.emit(formOutcomeEvent);

        if(((taskName  == 'Scan Validation') || (taskName  == 'Order Validation')) && ((outcome == 'Submit') || (outcome == 'Cancel'))){
            setTimeout(() => {
                if(outcome == 'Cancel'){
                    this.taskListService.unclaimTask(this.taskId).subscribe((res) => {
                        console.log('Cancelling task..');
                        console.dir(res);
                    });
                }
                this.router.navigate([`apps/${this.appId}/user-portal`]);
            }, 1000);
        }    
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    onFormChange() {
        this.formService.formFieldValueChanged.subscribe(
            (e: FormFieldEvent) => {
                const eventChanges = JSON.stringify(e.form.values);
                if (eventChanges !== this.taskFormValues) {
                    this.formChange.emit(e.form);
            }
        }
        );
    }
}
