import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPortalKendoComponent } from './user-portal-kendo.component';

describe('UserPortalKendoComponent', () => {
  let component: UserPortalKendoComponent;
  let fixture: ComponentFixture<UserPortalKendoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPortalKendoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPortalKendoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
