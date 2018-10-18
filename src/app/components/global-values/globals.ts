import { Injectable } from '@angular/core';
import { BpmUserModel } from '../../models/bpm-user.model';

@Injectable()
export class GlobalVariables {
  role: string = 'test'; 
  defaultProcessInstanceID: string = 'test';
  currentAppId = '';
  currentTaskId = '';
  currentProcessInstanceId = '';
  loggedInUser = new BpmUserModel();
  rolesOfLoggedUser = [];
}