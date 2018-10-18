import { OnInit, OnDestroy, Component, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { ReferenceDataService } from '../../services/reference-data.service';
import { ReferenceDataModelAPIResponse } from '../../models/reference-data.model';
import { ReferenceDataModel } from '../../models/reference-data.model';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { ProcessInstanceVariable, ProcessInstance, ProcessService, TaskListService, TaskDetailsModel, ProcessDefinitionRepresentation } from '@alfresco/adf-process-services';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AppConfigService, BpmUserService } from '@alfresco/adf-core';
import { GlobalVariables } from '../global-values/globals';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ReferenceDataService]
})



export class UserPortalComponent implements AfterViewInit, OnInit, OnDestroy {

  displayedColumns = ['select', 'nycdrsId', 'labnextId', 'scan', 'patient', 'externalId', 'doctorId', 'patient', 'sentDate', 'requestedDeliveryDate', 'owner', 'taskDescription', 'status'];

  dataSource: MatTableDataSource<ReferenceDataModel>;
  highlightedRows = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected = new FormControl(0);
  processInstanceID: string = null;
  taskID: string = null;
  currentUserId: number = -1;
  sub: Subscription;
  appId: string = null;
  doctorName: string = null;
  doctorAddress: string = null;

  recordsList: ReferenceDataModelAPIResponse[];
  loading: boolean = false;
  count: number = 0;
  landingRoutePage: string = null;
  currentTab: string = null;
  currentLoggedInUserName: string = null;
  currentLoggedInUserGroups: string[] = [];

  constructor(private referenceDataService: ReferenceDataService, private route: ActivatedRoute, private router: Router,
    private appConfig: AppConfigService,
    private processService: ProcessService,
    private taskListService: TaskListService,
    private bpmUserService: BpmUserService,
    private globalValues: GlobalVariables
  ) {
    const data: ReferenceDataModel[] = []
    this.dataSource = new MatTableDataSource(data);

  }

  ngOnInit() {
    this.loading = true;
    this.sub = this.route.parent.params.subscribe(params => {
      this.appId = params['appId'];
      console.log('Current App ID = ' + this.appId);
    });
    this.buildDashboardTable('nycdrs-inbox');

    this.bpmUserService.getCurrentUserInfo().subscribe(data => {
      this.currentLoggedInUserName = data.firstName;
      for (var i = 0; i < data.groups.length; i++) {
        this.currentLoggedInUserGroups[this.currentLoggedInUserGroups.length] = data.groups[i].name;
      }
      this.globalValues.loggedInUser.groups = this.currentLoggedInUserGroups;


    });
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000);
  }

  isTaskOwnedByLoggedUser(row) {
    // console.log('***  *** *** Current Logged In User = '+this.currentLoggedInUserName+' ***  *** *** ownerName = '+ownerName);
    // console.dir(this.globalValues.loggedInUser.groups);
    return (row.owner == this.currentLoggedInUserName) || (this.globalValues.loggedInUser.groups.indexOf(row.owner) != -1);
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    console.log('index => ', tabChangeEvent.tab.textLabel);

    switch (tabChangeEvent.tab.textLabel) {
      case 'Inbox': {
        this.displayedColumns = ['nycdrsId', 'labnextId', 'scan', 'externalId', 'doctorId', 'patient', 'sentDate', 'requestedDeliveryDate', 'owner', 'taskDescription', 'status'];
        this.buildDashboardTable('nycdrs-inbox');
        this.currentTab = 'nycdrs-inbox';
        break;
      }
      case 'Claimed': this.buildDashboardTable('nycdrs-claimed'); break;
      case 'Open Cases': {
        this.displayedColumns = ['nycdrsId', 'labnextId', 'scan', 'externalId', 'doctorId', 'patient', 'sentDate', 'requestedDeliveryDate', 'owner', 'taskDescription', 'group', 'status'];
        this.buildDashboardTable('nycdrs-open-cases');
        this.currentTab = 'nycdrs-open-cases';
        break;
      }
      case 'Closed Cases': this.buildDashboardTable('nycdrs-closed-cases'); break;
    }
  }

  buildDashboardTable(tableName) {

    this.referenceDataService.getValues(tableName).subscribe(
      (res: ReferenceDataModel[]) => {
        setTimeout(() => {
          console.dir(res);
          this.loading = false;
          this.dataSource = new MatTableDataSource(res);
          this.ngAfterViewInit();

          // let instanceList = res['instanceList'];
          // this.instanceList = instanceList;

          // for (var i = 0; i < instanceList.length; i++) {
          //     this.watchListMap.set(instanceList[i], instanceList[i]);
          // }
          // console.log('*** Immediately after ***');
          // console.dir(this.watchListMap);


          // this.iconType = 'material-icons://remove_red_eye';

        }, 500);
      },
      (err) => {
        console.log(err);
      }
    );


    // this.cowfishService.getDataList().subscribe(
    //     (res: CowfishDashboardModelAPIResponse[]) => {

    //         console.log('*** First Response from DATA call ***');
    //         console.log("*** Total Records = "+res['CowfishScores'].length+" ***");



    //         for (var i = 0; i < res['CowfishScores'].length; i++) {
    //             let scoreObject = res['CowfishScores'][i];
    //             scoreObject['Rank'] = (i + 1);
    //             scoreObject['TimeTaken'] = scoreObject['TimeTaken'] / 1000;
    //         }

    //         this.loading = false;
    //         this.dataSource = new MatTableDataSource(res['CowfishScores']);
    //         this.ngAfterViewInit();

    //     },
    //     (err) => {
    //         console.log(err);
    //     }
    // );
  }

  isDataLoading(): boolean {
    return this.loading;
  }

  // reloadDashboardTable() {
  //     this.buildDashboardTable();

  //     setTimeout(() => {
  //         this.count++;
  //         this.reloadDashboardTable();
  //         console.log('Reload # '+this.count);
  //     }, 5000);

  // }

  // returnHome() {
  //     this.landingRoutePage = this.appConfig.get('landing-page', 'dashboard/default');
  //     this.router.navigate([`apps/${this.globalValues.currentAppId}/${this.landingRoutePage}`]);
  // }

  selectRow(row) {
    console.log('*** Into the selectRow() ***' + this.isTaskOwnedByLoggedUser(row));
    if (this.isTaskOwnedByLoggedUser(row)) {
      console.dir(row);
      if (row.instanceId) {
        this.navigateToTask(row.instanceId);
      } else {
        this.startProcessInstance(row);
      }
    }
  }

  startProcessInstance(row) {
    console.log('Row is selected');
    console.log('ID of Row = ' + row.id);
    console.dir(row);
    this.loading = true;
    this.highlightedRows = [];
    this.highlightedRows.push(row);

    let processDefinitionId = this.appConfig.get<string>('nycdrs-default-process-definition-id');
    let name = this.appConfig.get<string>('nycdrs-default-process-name') + ' - ' + new Date().toLocaleString();

    this.processService.getProcessDefinitions(parseInt(this.appId)).subscribe((res: ProcessDefinitionRepresentation[]) => {
      for (var i = 0; i < res.length; i++) {
        if (res[i].id.indexOf('Validation') != -1) {
          console.log('Process Definition ID: ', res[i].id);
          processDefinitionId = res[i].id;
          break;
        }
      }
    }, error => {
      console.log('Error: ', error);
    });

    const variables: ProcessInstanceVariable[] = [
      { name: 'id', value: row.id },
      { name: 'table_name', value: this.currentTab }
    ];

    //Start Process
    setTimeout(() => {
      this.processService.startProcess(processDefinitionId, name, null, null, variables).subscribe((processInstance: ProcessInstance) => {
        console.log('ProcessInstance: ', processInstance);
        this.processInstanceID = processInstance.id;
        this.globalValues.currentProcessInstanceId = processInstance.id;
      }, error => {
        console.log('Error: ', error);
      });
    }, 500);


    //Get Tasks
    setTimeout(() => {
      this.processService.getProcessTasks(this.processInstanceID)
        .subscribe((taskList: TaskDetailsModel[]) => {
          console.log('Instance ID from TaskList --> ' + this.processInstanceID);
          console.log('Task List  = ', taskList)
          console.log('Task ID = ' + taskList[0].id);
          this.taskID = taskList[0].id;
          this.globalValues.currentTaskId = this.taskID;
        }, error => {
          console.log('Error: ', error);
        });
    }, 5000);


    //Route to Task Details Page
    setTimeout(() => {
      console.log('Starting navigation to TaskDetails');
      this.router.navigateByUrl('taskdetails/' + this.appId + '/' + this.taskID);
    }, 5500);
  }



  navigateToTask(processInstanceID) {

    console.log('processInstanceID -->', processInstanceID);

    //Get Tasks
    setTimeout(() => {
      this.processService.getProcessTasks(processInstanceID)
        .subscribe((taskList: TaskDetailsModel[]) => {
          console.log('Task ID = ' + taskList[0].id);
          this.taskID = taskList[0].id;
          this.globalValues.currentTaskId = this.taskID;
        }, error => {
          console.log('Error: ', error);
        });
    }, 500);

    //Assign Task
    setTimeout(() => {
      this.taskListService.assignTaskByUserId(this.taskID, this.globalValues.loggedInUser.id)
        .subscribe((taskDetails: TaskDetailsModel) => {

        }, error => {
          console.log('Error: ', error);
        });
    }, 1000);

    //Route to Task Details Page
    setTimeout(() => {
      console.log('Starting navigation to TaskDetails');
      this.router.navigateByUrl('taskdetails/' + this.appId + '/' + this.taskID);
    }, 1500);
  }

  applyFilter(filterValue: string) {
    console.log('Applying filter --> ' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.ngAfterViewInit();
  }

  hoverIn(doctorId) {
    this.doctorName = "";
    this.doctorAddress = "";
    let params = 'doctors/'+doctorId;
    console.log(params);


    this.referenceDataService.getValues(params).subscribe(
      (res: ReferenceDataModel[]) => {
        // setTimeout(() => {
          // console.dir(res);
          this.doctorName = res['name'];
          this.doctorAddress = res['address'];
        // }, 100);
      },
      (err) => {
        // console.log(err);
      }
    )};
}



