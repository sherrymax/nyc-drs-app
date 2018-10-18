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

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MediaQueryService } from '../src/app/services/media-query.service';

import {
  CoreModule,
  AppConfigService,
  AppConfigServiceMock,
  TranslationService,
  TranslationMock
} from '@alfresco/adf-core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AlfrescoApiService } from '@alfresco/adf-core';

import {
  MaterialModule
} from '../src/app/material.module';
import { MockAPWRoutes, DummyComponent } from '../src/app/test-mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

beforeEach(() => {
  getTestBed().configureTestingModule({
      imports: [
        CoreModule,
        CommonModule,
        MaterialModule,
        RouterTestingModule.withRoutes(MockAPWRoutes),
        FlexLayoutModule,
        BrowserAnimationsModule
      ],
      declarations: [
        DummyComponent
      ],
      providers: [
        MediaQueryService,
        AlfrescoApiService,
          {provide: AppConfigService, useClass: AppConfigServiceMock},
          {provide: TranslationService, useClass: TranslationMock}
      ]
  });
});

afterEach(() => {
  getTestBed().resetTestingModule();
});
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
