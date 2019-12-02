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
    name: '',
    relativePath: "",
    type: "directory",
    isSymbolicLink: false,
    size: "0 B",
    children: []
  }

  constructor(private mainService: MainService, private toastr: ToastrService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.bucket && this.directoryTree.children.length == 0 ) {
      this.mainService.getAllDirectories(this.bucket.bucketName).subscribe((directoryTreeResponse: any) => {
        if (directoryTreeResponse.success) {
          this.directoryTree.children.push(directoryTreeResponse.tree)
        }
        console.log(this.directoryTree)
      })
    }
  }

  _moveObjects() {
    var moveObjects = {
      bucketName: this.bucket.bucketName,
      dest: '/' + Bus.FILE_MOV_PATH['relativePath'],
      paths: []
    }

    this.objects.map((object, i) => {
      moveObjects.paths.push(this.currentPath + object['name'])
    })

    this.mainService.moveObjects(moveObjects).subscribe((moveObjectsStatus: any) => {
      moveObjectsStatus['spliceMoveObjects'] = Bus.FILE_MOV_PATH['relativePath'] == '' ? ( this.currentPath != '/' ) : ('/' + Bus.FILE_MOV_PATH['relativePath'] + '/' != this.currentPath)
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
