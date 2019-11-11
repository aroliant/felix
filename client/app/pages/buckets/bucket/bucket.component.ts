import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {

  bucketName = 'aroliant'
  currentPath = '/'
  searchInput = ''
  bucket: any
  objects = []
  objectStates = []
  states = {
    checkedAll: false,
  }
  modalStates = {
    delete: false,
    meta: false,
    moveFiles: false,
    permissions: false,
    share: false,
    uploadFiles: false,
  }
  currentActionIndex = 0

  constructor(private route: ActivatedRoute, private mainService: MainService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.bucketName = params.bucketName;
      this.mainService.getBucket(this.bucketName).subscribe((res: any) => {
        if (res.success) {
          this.bucket = res.bucket;
        }
      });

      const filters = {
        bucketName: this.bucketName,
        path: this.currentPath
      }
      this.mainService.searchObjects(filters).subscribe((objectsResult: any) => {
        this.objects = objectsResult.objects
        this.objects.map((object, index) => {
          object.showActions = false
          object.isSelected = false
          return object
        })
      })

    })
  }

  selectAll(state) {
    console.log('[action] -> selectAll')
    this.objects.map((object, index) => {
      object.isSelected = state
      return object
    })
  }

  selectObject(event, index) {
    console.log('[action] -> selectObject')
    this.states.checkedAll = false
    const val = event.target.value === 'on' ? true : false
    this.objects[index].isSelected = val
  }

  showActions(index) {
    console.log('[action] -> showActions', index)
    this.objects[index].showActions = true
    this.currentActionIndex = index
    const self = this
    setTimeout(() => {
      self.currentActionIndex = -1
    }, 500)
  }

  hideAllActions() {
    console.log('[action] -> hideAllActions')
    this.objects.map((state, i) => {
      if (this.currentActionIndex !== i) {
        state.showActions = false
      }
      return state
    })
  }

  search() {
    // TODO :     
  }

  deleteObject() {
    // TODO :
  }

  deleteObjects(objects) {
    this.mainService.deleteObjects(objects).subscribe((res: any) => {
      if (res.success) {
        // TODO : Remove from UI
      }
    })
  }

  // Show

  showManagePermissionsModal() {
    this.modalStates.permissions = true
  }

  showManageMetaModal() {

  }

  showMoveObjectsModal() {

  }

  showShareObjectModal() {

  }

  showDeleteModal() {

  }

  uploadFiles(event) {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      this.upload(files[i], 0)
    }

  }

  uploadFolders(event) {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      this.upload(files[i], 0)
    }

  }

  upload(file, uploadingIndex) {

    console.log(file)

    const fileLength = file.size;

    let uploadFilePath = ''

    if (file.webkitRelativePath) {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.webkitRelativePath}`
    } else if (file.mozRelativePath) {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.mozRelativePath}`
    } else {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.name}`
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:3000/bucket/objects/${uploadFilePath}`, true);
    xhr.upload.onprogress = function (e) {
      const percentComplete = Math.ceil((e.loaded / e.total) * 100);
      console.log(percentComplete)
    };

    xhr.onload = function () {
      if (this.status === 200) {
        console.log(this.status)
      }
    }

    if (fileLength > 0) {
      xhr.send(formData);
    }
  }

}
