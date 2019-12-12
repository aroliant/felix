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
  @Output() onHide = new EventEmitter<any>();

  directoryTree = {
    name: '',
    relativePath: '',
    type: 'directory',
    isSymbolicLink: false,
    size: '0 B',
    children: []
  }

  constructor(private mainService: MainService, private toastr: ToastrService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.bucket && this.directoryTree.children.length === 0) {
      this.mainService.getAllDirectories(this.bucket.bucketName).subscribe((directoryTreeResponse: any) => {
        if (directoryTreeResponse.success) {
          this.directoryTree.children.push(directoryTreeResponse.tree)
        }
      })
    }
  }

  createNewFolder() {
    const data = {
      bucketName: this.bucket.bucketName,
      path: `/${Bus.FILE_MOV_PATH.relativePath}/new_folder`
    }
    this.mainService.createFolder(data).subscribe((res: any) => {
      if (res.success) {
        this.mainService.getAllDirectories(this.bucket.bucketName).subscribe((directoryTreeResponse: any) => {
          this.directoryTree.children = []
          if (directoryTreeResponse.success) {
            this.directoryTree.children.push(directoryTreeResponse.tree)
          }
        })
      }
    })
  }

  _moveObjects() {
    const moveObjects = {
      bucketName: this.bucket.bucketName,
      dest: '/' + Bus.FILE_MOV_PATH.relativePath,
      paths: []
    }

    this.objects.map((object, i) => {
      moveObjects.paths.push(this.currentPath + object['name'])
    })

    this.mainService.moveObjects(moveObjects).subscribe((moveObjectsStatus: any) => {
      // Determining if there is a need to remove the moved objects from current page.
      // Remove from UI only when the move folder and currently opened folder are not the same

      const _removeFromUI = Bus.FILE_MOV_PATH.relativePath === '' ?
        (this.currentPath !== '/') : ('/' + Bus.FILE_MOV_PATH.relativePath + '/' !== this.currentPath)

      moveObjectsStatus['removeFromUI'] = _removeFromUI
      this.onHide.emit(moveObjectsStatus);
    })
  }

  hideModal() {
    this.onHide.emit({ success: false })
  }
}
