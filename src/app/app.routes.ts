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

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardBpm, AuthGuardEcm } from '@alfresco/adf-core';

import {
    AppsContainerComponent,
    AppContainerComponent,
    AppsComponent,
    CreateProcessComponent,
    CreateTaskComponent,
    DashboardComponent,
    LoginComponent,
    ProcessDetailsContainerComponent,
    ProcessListContainerComponent,
    TaskDetailsContainerComponent,
    TaskListContainerComponent,
    SettingComponent,
    ProvidersComponent,
    FilesComponent,
    FileViewComponent
} from './components';
import { UserPortalComponent } from './components/user-portal/user-portal.component';
import { UserPortalKendoComponent } from './components/user-portal-kendo/user-portal-kendo.component';

export const appRoutes: Routes = [
    { path: '',   redirectTo: '/apps', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'settings', component: SettingComponent },
    { path: 'providers', component: ProvidersComponent },
    {
        path: 'apps',
        component: AppsContainerComponent,
        canActivate: [ AuthGuardBpm ],
        children: [ { path: '', component: AppsComponent } ]
    },
    {
        path: 'apps/:appId',
        component: AppContainerComponent,
        canActivate: [ AuthGuardBpm ],
        children: [
            { path: 'tasks', component: TaskListContainerComponent },
            { path: 'tasks/new', component: CreateTaskComponent },
            { path: 'tasks/:taskFilterId', component: TaskListContainerComponent },
            { path: 'processes', component: ProcessListContainerComponent },
            { path: 'processes/new', component: CreateProcessComponent },
            { path: 'processes/:processFilterId', component: ProcessListContainerComponent },
            { path: 'dashboard/default', component: DashboardComponent },
            { path: 'user-portal', component: UserPortalComponent },
            { path: 'user-portal-kendo', component: UserPortalKendoComponent }

        ]
    }
    ,
    {
        path: 'apps/:appId',
        component: AppContainerComponent,
        canActivate: [ AuthGuardEcm ],
        children: [
            { path: 'files', component: FilesComponent},
            { path: 'files/:id', component: FilesComponent}
        ]
    },
    { path: 'apps/:appId/files/:nodeId/view', component: FileViewComponent, canActivate: [AuthGuardEcm] },
    { path: 'processdetails/:appId/:processInstanceId', component: ProcessDetailsContainerComponent, canActivate: [AuthGuardBpm] },
    { path: 'taskdetails/:appId/:taskId', component: TaskDetailsContainerComponent, canActivate: [AuthGuardBpm] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
