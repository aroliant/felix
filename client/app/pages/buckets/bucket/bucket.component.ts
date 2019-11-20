import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'client/app/services/main.service';
import { environment } from '../../../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'client/app/services/helper.service';
@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {

  bucketName = ''
  currentPath = '/'
  bucketBreadcrumbs = [{ path: '/', name: '/' }]
  searchInput = ''
  newFolderName = ''
  bucket: any
  objects = []
  actions = {
    objectsToDelete: [],
    objectsToMove: [],
    files: [],
    selectedObjectsCount: 0
  }

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

  objectNameBeforeRenaming = ''

  currentActionIndex = 0

  API_URL = environment.API_URL

  constructor(private route: ActivatedRoute,
    private mainService: MainService,
    private router: Router,
    private toast: ToastrService,
    private helperService: HelperService,
    private toastr: ToastrService
  ) { }

  setDestination(str) {
    console.log(str)
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.subscribe((params) => {
      this.bucketName = params.bucketName;
      this.mainService.getBucket(this.bucketName).subscribe((res: any) => {
        if (res.success) {
          this.bucket = res.bucket;          
        }
      });

      this.route.queryParams.subscribe((queryParams) => {

        const filters = {
          bucketName: this.bucketName,
          path: this.currentPath
        }

        if (queryParams.path) {
          filters.path = queryParams.path
          this.currentPath = filters.path
          this.bucketBreadcrumbs = this.makeBreadcrumb(this.currentPath)
        }

        this.mainService.searchObjects(filters).subscribe((objectsResult: any) => {
          this.objects = objectsResult.objects
          this.objects.map((object, index) => {
            object.showActions = false
            object.isSelected = false
            object.onEditMode = false
            return object
          })
        })

      })


    })


  }

  selectAll(state) {
    if (state)
      this.actions.selectedObjectsCount = this.objects.length
    else
      this.actions.selectedObjectsCount = 0
    this.objects.map((object, index) => {
      object.isSelected = state
      return object
    })
  }

  selectObject(event, index) {
    console.log('[action] -> selectObject')
    if (event.target.checked)
      ++this.actions.selectedObjectsCount
    else
      --this.actions.selectedObjectsCount
    this.states.checkedAll = false
    const val = event.target.value === 'on' ? true : false
    this.objects[index].isSelected = val
  }

  showActions(index) {
    console.log('[action] -> showActions', index)
    if (!this.objects[index].showActions) {
      this.objects[index].showActions = true
    } else {
      this.objects[index].showActions = false
    }

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

  copyToClipboard(string) {
    this.helperService.copyToClipboard(string)
    this.toastr.success('Copied to Clipboard!');
  }

  searchFilter() {
    if (this.searchInput === '') {

      const filters = {
        bucketName: this.bucketName,
        path: this.currentPath
      }

      this.mainService.searchObjects(filters).subscribe((objectsResult: any) => {
        if (objectsResult.success) {
          this.objects = objectsResult.objects
        }
      })

    } else {

      const filters = {
        bucketName: this.bucketName,
        path: this.currentPath,
        name: this.searchInput
      }

      this.mainService.searchObjects(filters).subscribe((objectsResult: any) => {
        if (objectsResult.success) {
          this.objects = objectsResult.objects
        }
      })

    }

  }

  onDelete(event) {
    if (event.success) {
      this.actions.objectsToDelete.map((objectToDelete, i) => {
        this.objects.splice(this.objects.indexOf(this.actions.objectsToDelete[i]), 1)
      })
      this.toastr.success(event.message, 'Success!');
    } else {
      this.toastr.error(event.message);
    }
    this.modalStates.delete = false
    this.actions.objectsToDelete = []
  }

  onHide(event) {
    this.modalStates = {
      delete: false,
      meta: false,
      moveFiles: false,
      permissions: false,
      share: false,
      uploadFiles: false,
    }
  }

  browseFolder(folderName) {
    const path = this.currentPath + folderName + '/'
    this.router.navigate(['buckets', this.bucketName], { queryParams: { path: path } })
  }

  // Show Modals

  showManagePermissionsModal() {
    this.modalStates.permissions = true
  }

  showManageMetaModal() {
    this.modalStates.meta = true
  }

  showMoveObjectsModal() {
    this.modalStates.moveFiles = true
  }

  showShareObjectModal() {
    this.modalStates.share = true
  }

  showDeleteModal(i) {
    this.actions.objectsToDelete = []
    this.modalStates.delete = true
    this.actions.objectsToDelete.push(this.objects[i])
    console.log(this.actions.objectsToDelete)
  }

  showDeletesModel() {
    this.actions.objectsToDelete = []
    this.modalStates.delete = true
    this.objects.map((object, index) => {
      if (object.isSelected) {
        this.actions.objectsToDelete.push(object)
      }
    })
    console.log(this.actions.objectsToDelete)
  }

  showMoveObjectModal(i) {
    this.modalStates.moveFiles = true
    this.actions.objectsToMove.push(this.objects[i])
  }

  showMoveObjectsModel() {
    this.modalStates.moveFiles = true
    this.objects.map((object, index) => {
      if (object.isSelected) {
        this.actions.objectsToMove.push(object)
      }
    })
  }

  hideDeleteModal() {
    this.modalStates.meta = false
    this.actions.objectsToDelete = []
  }

  hidePermissionsModal() {
    this.modalStates.permissions = false
  }

  hideManageMetaModal() {
    this.modalStates.meta = false
  }

  hideMoveObjectsModal() {
    this.modalStates.moveFiles = false
    this.actions.objectsToMove = []
  }

  hideShareObjectModal() {
    this.modalStates.share = false
  }

  createNewFolder() {
    this.objectNameBeforeRenaming = '' // folder newly created
    this.objects.unshift({
      name: '',
      size: 0,
      objectType: 'folder',
      createdAt: new Date(),
      modifiedAt: new Date(),
      isSelected: false,
      showActions: false,
      onEditMode: true,
    })
  }

  editObject(event, i) {
    if (event.keyCode == 13) {

      if (this.objectNameBeforeRenaming == '') {

        const newFolder = {
          path: this.currentPath + this.objects[i].name,
          bucketName: this.bucket.bucketName
        }

        this.mainService.createFolder(newFolder).subscribe((newFolderStatus: any) => {
          if (newFolderStatus.success) {
            this.closeFolderEditMode(i)
            this.toastr.success(newFolderStatus.message, 'Success!')
          } else {
            this.toastr.error(newFolderStatus.message)
          }
        })

      } else {

        const renameObject = {
          bucketName: this.bucket.bucketName,
          paths: [this.currentPath + this.objectNameBeforeRenaming],
          dest: this.currentPath + this.objects[i].name
        }

        this.mainService.moveObjects(renameObject).subscribe((renameObjectStatus: any) => {
          if (renameObjectStatus.success) {
            this.closeFolderEditMode(i);
            this.toastr.success('Renamed Sucessfully', 'Success!')
          }
        })

      }

    }
  }

  openFolderEditMode(i) {
    this.objectNameBeforeRenaming = this.objects[i].name
    this.objects.map((object, index) => {
      object.onEditMode = false
    })
    this.objects[i].onEditMode = true
  }

  closeFolderEditMode(i) {
    this.objects[i].onEditMode = false
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
    const self = this
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
    xhr.open('PUT', `${this.API_URL}/bucket/objects/${uploadFilePath}`, true);
    xhr.upload.onprogress = function (e) {
      const percentComplete = Math.ceil((e.loaded / e.total) * 100);
      console.log(percentComplete)
    };

    xhr.onload = function () {
      if (this.status === 200) {
        self.toast.success('', 'File Uploaded')
      }
    }

    if (fileLength > 0) {
      xhr.send(formData);
    }
  }

  navigateBucketBreadcrumb(path) {
    this.router.navigate(['buckets', this.bucketName], { queryParams: { path: path } })
  }

  makeBreadcrumb(path) {

    const pathArray = path.split('/')
    let root = '/'
    const crumbs = [{
      path: '/',
      name: '/'
    }]

    for (let i = 1; i < pathArray.length - 1; i++) {

      root = root + pathArray[i] + '/'

      crumbs.push({
        path: root,
        name: pathArray[i],
      })

    }

    return crumbs
  }

}
