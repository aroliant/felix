import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  @Input() show;
  @Input() object: any;
  @Input() bucket: any;
  @Input() currentPath;
  @Output() public onDelete = new EventEmitter<String>();

  constructor(private mainService: MainService) { }

  ngOnInit() {

  }

  deleteObject() {

    const path = this.currentPath + this.object['name'] + (this.object['objectType'] == 'folder' ? '/' : '');
    const paths = [path]
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
