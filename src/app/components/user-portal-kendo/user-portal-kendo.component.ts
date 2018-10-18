import { Component } from '@angular/core';
import { products } from './products';

@Component({
  selector: 'app-user-portal-kendo',
  templateUrl: './user-portal-kendo.component.html',
  styleUrls: ['./user-portal-kendo.component.scss']
})
export class UserPortalKendoComponent {

  public gridData: any[] = products;

}