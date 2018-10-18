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

import { FilterRepresentationModel } from '@alfresco/adf-process-services';

export let fakeGlobalFilter = [];

fakeGlobalFilter.push(new FilterRepresentationModel({
    name: 'FakeInvolvedTasks',
    id: 10,
    filter: { state: 'open', assignment: 'fake-involved' }
}));

fakeGlobalFilter.push(new FilterRepresentationModel({
    name: 'FakeMyTasks1',
    id: 11,
    filter: { state: 'open', assignment: 'fake-assignee' }
}));

fakeGlobalFilter.push(new FilterRepresentationModel({
    name: 'FakeMyTasks2',
    id: 12,
    filter: { state: 'open', assignment: 'fake-assignee' }
}));

export let fakeTaskDefaultFilter  = <FilterRepresentationModel>{
    id: 1,
    appId: 101,
    name: 'FakeMyTasks',
    recent: true,
    icon: 'fake-icon',
    filter: null,
    index: 1
};
