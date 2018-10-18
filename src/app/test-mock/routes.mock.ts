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

import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    template: ''
})
export class DummyComponent {
}

export const MockAPWRoutes: Routes = [
    { path: 'login', component: DummyComponent },
    { path: 'settings', component: DummyComponent },
    { path: 'processdetails/:appId/:processInstanceId', component: DummyComponent },
    { path: 'taskdetails/:appId/:taskId', component: DummyComponent },
    {
        path: 'apps/:appId',
        component: DummyComponent,
        children: [
            { path: 'tasks/new', component: DummyComponent },
            { path: 'tasks/:taskFilterId', component: DummyComponent },
            { path: 'processes/new', component: DummyComponent },
            { path: 'processes/:processFilterId', component: DummyComponent },
            { path: 'dashboard/default', component: DummyComponent }
        ]
    },
    {
        path: 'apps',
        component: DummyComponent,
        children: [ { path: '', component: DummyComponent } ]
    },
    { path: '',   redirectTo: '/apps', pathMatch: 'full' }
];
