import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  @Input() show;
  @Input() objects: [];
  @Input() bucket: any;
  @Input() currentPath;
  @Output() public onDelete = new EventEmitter<String>();

  constructor(private mainService: MainService) { }

  ngOnInit() {
  }

  deleteObject() {

    var paths = [];
    this.objects.map((object, i) => {
      paths.push(this.currentPath + object['name'] + (object['objectType'] == 'folder' ? '/' : ''))
    })

    this.mainService.deleteObjects({
      bucketName: this.bucket.bucketName,
      paths: paths
    }).subscribe((res: any) => {
      if (res.success) {
        this.onDelete.emit(res);
      }
    })
  }

  hideModal() {
    this.show = false
  }

}
