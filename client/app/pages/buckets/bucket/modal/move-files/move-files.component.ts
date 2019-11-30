import { Component, OnInit, Input, Output, EventEmitter, OnChanges, } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { ToastrService } from 'ngx-toastr';
import Bus from '../../../../../../app/services/Bus.service';

@Component({
  selector: 'app-modal-move-files',
  templateUrl: './move-files.component.html',
  styleUrls: ['./move-files.component.scss']
})
export class MoveFilesComponent implements OnInit, OnChanges {

  @Input() show: Boolean;
  @Input() objects: [];
  @Input() bucket: any;
  @Input() currentPath;
  @Output() onHide = new EventEmitter<boolean>();

  directoryTree = {
    children: []
  }

  constructor(private mainService: MainService, private toastr: ToastrService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.bucket) {
      this.mainService.getAllDirectories(this.bucket.bucketName).subscribe((res: any) => {
        if (res.success) {
          this.directoryTree = res.tree
          console.log(this.directoryTree)
        }
      })
    }
  }

  _moveObjects() {
    console.log("Destination Path: " + Bus.FILE_MOV_PATH['relativePath'])
    var moveObjects = {
      bucketName: this.bucket.bucketName,
      dest: '/' + Bus.FILE_MOV_PATH['relativePath'],
      paths: []
    }

    this.objects.map((object, i) => {
      moveObjects.paths.push(this.currentPath + object['name'])
    })

    console.log(moveObjects)

    this.mainService.moveObjects(moveObjects).subscribe((moveObjectsStatus: any) => {
      this.onHide.emit(moveObjectsStatus);
    })
  }

  setDestination(str) {

  }

  hideModal() {
    this.show = false
    this.onHide.emit(false)
  }
}
