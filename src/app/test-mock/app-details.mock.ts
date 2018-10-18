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

 import { AppDefinitionRepresentationModel,
    FilterProcessRepresentationModel} from '@alfresco/adf-process-services';


export let fakeTaskFilter = new FilterProcessRepresentationModel({
        'name': 'My Tasks',
        'appId': '55',
        'id': '111',
        'recent': true,
        'icon': 'glyphicon-random',
        'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
});

export let fakeTaskFilters = {
    size: 1, total: 1, start: 0,
    data: [fakeTaskFilter]
};

export let fakeProcessFilter = new FilterProcessRepresentationModel({
        'name': 'Running',
        'appId': '55',
        'id': '65',
        'recent': true,
        'icon': 'glyphicon-random',
        'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
    });

    export let defaultFakeProcessFilter = new FilterProcessRepresentationModel({
        'name': 'Running',
        'appId': 22,
        'id': 333,
        'recent': true,
        'icon': 'glyphicon-random',
        'filter': {'processDefinitionId': 12986, 'appDefinitionId': 123, 'sort': 'created-desc', 'name': '', 'state': 'running'}
    });

export let fakeEmptyFilters = {
    size: 0, total: 0, start: 0,
    data: []
};

export let fakeError = {
    message: null,
    messageKey: 'GENERAL.ERROR.FORBIDDEN'
};

export let fakeApp1 = new AppDefinitionRepresentationModel({
    deploymentId: 26,
    name: 'Expense processes',
    icon: 'expense-cloud',
    description: null,
    theme: 'theme-6',
    modelId: 4,
    id: 1
});

export let fakeApp2 = new AppDefinitionRepresentationModel({
    deploymentId: 2501,
    name: 'Claim app',
    icon: 'claim-asterisk',
    description: null,
    theme: 'theme-1',
    modelId: 1002,
    id: 1000
});

export let mockPdfData = atob(
    'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
    'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
    'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
    'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
    'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
    'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
    'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
    'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
    'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
    'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
    'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
    'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
    'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
