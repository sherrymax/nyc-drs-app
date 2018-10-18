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

import { Injectable, } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

@Injectable()
export class MediaQueryService {

    private mediaQuerySubject: BehaviorSubject<string> ;
    mediaQuery$: Observable<string>;

    private mobileSubject: BehaviorSubject<boolean> ;
    mobile$: Observable<boolean>;

    mobileBreakPoints = ['xs'];

    private mobileBreaks() {
        this.mediaQuery$.subscribe( (media) => {
            const result = this.isMobileBreakPoint(media);
            this.mobileSubject.next(result);
        });
    }

    isMobileBreakPoint(alias): boolean {
        return _.includes(this.mobileBreakPoints, alias);
    }

    constructor( private media: ObservableMedia) {
        this.mediaQuerySubject = new BehaviorSubject('xl');
        this.mediaQuery$ = this.mediaQuerySubject.asObservable();

        this.mobileSubject = new BehaviorSubject(false);
        this.mobile$ = this.mobileSubject.asObservable();

        this.media.subscribe((change: MediaChange) => {
            this.mediaQuerySubject.next(change.mqAlias);
        });

        this.mobileBreaks();
    }
}
