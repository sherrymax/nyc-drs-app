import { Component, OnInit } from '@angular/core';
import { CommentProcessModel, } from '@alfresco/adf-core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit{

  comments: CommentProcessModel[] = null;

  constructor() {
  }

  ngOnInit() {
    
    
    this.comments = [
      {
        id: 1,
        message: 'This product has to be created with special care as demanded by customer.',
        created: new Date('2018-02-16T10:10:10'),
        createdBy: {
          id: 1,
          email: 'jacub.yuhan@example.com',
          firstName: 'Jacub',
          lastName: 'Yuhan'
        },
        isSelected: false
      },
      {
        id: 2,
        message: 'Customer has special interest in the quality of end product. The quality of the product needs to be double checked.',
        created: new Date('2018-08-17T12:12:32'),
        createdBy: {
          id: 2,
          email: 'jacub.yuhan@example.com',
          firstName: 'Jacub',
          lastName: 'Yuhan'
        },
        isSelected: false
      }
    ];

    }

  

  onClickCommentRow(comment: CommentProcessModel) {
    console.log('Clicked row: ', comment);
  }

}
