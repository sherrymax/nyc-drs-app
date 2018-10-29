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

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule, MatSortModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { AppConfigService, TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { AdfModule } from './adf.module';

import { environment } from '../environments/environment';

import { AppRootComponent } from './app-root.component';
import { routing } from './app.routes';
import { ApplicationContentStateService } from './services/application-content-state.service';
import { MediaQueryService } from './services/media-query.service';
import { PreviewService } from './services/preview.service';
import { UnauthorisedErrorHandler } from './services/unauthorised-error-handler.service';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VersionManagerDialogAdapterComponent } from './components/files/version-manager-dialog-adapter.component';
import { MetadataDialogAdapterComponent } from './components/files/metadata-dialog-adapter.component';
import { CustomSourcesComponent } from './components/files/custom-sources.component';


import {
    AppsContainerComponent,
    AppsComponent,
    AppContainerComponent,
    BreadCrumbsActionsComponent,
    BreadCrumbsComponent,
    BreadCrumbsEntryComponent,
    CreateProcessComponent,
    CreateTaskComponent,
    DashboardComponent,
    DashboardSettingsComponent,
    HeaderComponent,
    LoginComponent,
    ProcessAttachmentComponent,
    ProcessDetailsComponent,
    ProcessDetailsContainerComponent,
    ProcessListPaginatorComponent,
    ProcessListContainerComponent,
    ProcessSidebarComponent,
    ProcessStatisticsComponent,
    ProcessToolbarComponent,
    SideMenuComponent,
    TaskAttachmentComponent,
    TaskDetailsContainerComponent,
    TaskFromComponent,
    TaskListContainerComponent,
    TaskSidebarComponent,
    TaskToolbarComponent,
    TaskListPaginatorComponent,
    UserProfileMenuComponent,
    SettingComponent,
    ProvidersComponent,
    DialogConfirmationComponent,
    FilesComponent,
    FileViewComponent
} from './components';
import { UserPortalComponent } from './components/user-portal/user-portal.component';
import { CommentComponent } from './components/comment/comment.component';
import { UserPortalKendoComponent } from './components/user-portal-kendo/user-portal-kendo.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { GlobalVariables } from './components/global-values/globals';


@NgModule({
    imports: [
        BrowserModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        AdfModule,
        ChartsModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        GridModule,
        MatPaginatorModule, 
        MatSortModule
        // ,CommentModule
    ],
    declarations: [
        AppRootComponent,
        AppsContainerComponent,
        AppContainerComponent,
        AppsComponent,
        BreadCrumbsActionsComponent,
        BreadCrumbsComponent,
        BreadCrumbsEntryComponent,
        CreateProcessComponent,
        CreateTaskComponent,
        DashboardComponent,
        DashboardSettingsComponent,
        HeaderComponent,
        LoginComponent,
        ProcessAttachmentComponent,
        ProcessDetailsComponent,
        ProcessDetailsContainerComponent,
        ProcessListPaginatorComponent,
        ProcessListContainerComponent,
        ProcessSidebarComponent,
        ProcessStatisticsComponent,
        ProcessToolbarComponent,
        SideMenuComponent,
        TaskAttachmentComponent,
        TaskDetailsContainerComponent,
        TaskFromComponent,
        TaskListContainerComponent,
        TaskSidebarComponent,
        TaskToolbarComponent,
        TaskListPaginatorComponent,
        UserProfileMenuComponent,
        SettingComponent,
        ProvidersComponent,
        DialogConfirmationComponent,
        FilesComponent,
        FileViewComponent,
        UserPortalComponent,
        CommentComponent,
        UserPortalKendoComponent,
        VersionManagerDialogAdapterComponent,
        MetadataDialogAdapterComponent,
        CustomSourcesComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: AppConfigService, useClass: environment.appConfigServiceType },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        },
        MediaQueryService,
        ApplicationContentStateService,
        PreviewService, GlobalVariables,
        { provide: ErrorHandler, useClass: UnauthorisedErrorHandler }
    ],
    exports: [
        DialogConfirmationComponent
    ],
    entryComponents: [
        DialogConfirmationComponent,
        CommentComponent
    ],
    bootstrap: [AppRootComponent]
})
export class AppModule { }
