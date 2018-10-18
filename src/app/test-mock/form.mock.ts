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
import { FormFieldModel, FormModel } from '@alfresco/adf-core';

export let sameFakeFormValue = {
    'values': {
        'clientname': 'New Task',
        'policyno': 1235,
        'billamount': 998,
        'hospitalname': 'General Hospital'
    }
};

export let fakeForm = {
    id: 1001,
    name: 'ISSUE_FORM',
    values: {
        'clientname': 'New Task',
        'policyno': 1235,
        'billamount': 1000,
        'hospitalname': 'General Hospital'
    }
};

export let changedformModelMock = {
    'field': new FormFieldModel(new FormModel()),
    'form': fakeForm,
    'isDefaultPrevented': false
};

export let changedFakeFormValue = {
    'values': {
        'clientname': 'New Task',
        'policyno': 1235,
        'billamount': 1000,
        'hospitalname': 'General Hospital'
    }
};
