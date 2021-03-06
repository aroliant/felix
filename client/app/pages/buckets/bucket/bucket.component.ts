import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'client/app/services/main.service';
import { environment } from '../../../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'client/app/services/helper.service';
import { Subject } from 'rxjs';
import { AuthService } from 'client/app/services/auth.service';
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
    selectedObjectsCount: 0,
    objectToShare: {},
    objectForPermissions: {},
    objectForMeta: {}
  }

  showLogOut = false

  showMainAction = false

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

  clickOutsideSubject: Subject<void> = new Subject<void>();

  objectNameBeforeRenaming = ''

  currentActionIndex = 0

  user = {}

  API_URL = environment.API_URL

  constructor(private route: ActivatedRoute,
    private mainService: MainService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private helperService: HelperService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.authService.getUser()
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
            object.originalName = object.name
            return object
          })
        })

      })


    })


  }

  selectAll(state) {
    if (state) {
      this.actions.selectedObjectsCount = this.objects.length
    } else {
      this.actions.selectedObjectsCount = 0
    }

    this.objects.map((object, index) => {
      object.isSelected = state
      return object
    })
  }

  selectObject(event, index) {
    if (event.target.checked) {
      ++this.actions.selectedObjectsCount
    } else {
      --this.actions.selectedObjectsCount
    }


    this.states.checkedAll = false
    const val = event.target.value === 'on' ? true : false
    this.objects[index].isSelected = val
  }

  showActions(index) {
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

  hideAllActions(event) {

    this.clickOutsideSubject.next()

    if (event.target.id === 'batchActionsMenu' || event.target.id === 'batchActionsMenuIcon') {
      this.showMainAction = !this.showMainAction
    } else {
      this.showMainAction = false
    }

    this.objects.map((state, i) => {
      if (this.currentActionIndex !== i) {
        state.showActions = false
      }
      return state
    })
  }

  copyToClipboard(string) {
    this.helperService.copyToClipboard(string)
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
      if (event.message !== undefined) {
        this.toastr.error(event.message)
      }
    }
    this.modalStates.delete = false
    this.actions.objectsToDelete = []
  }

  onHideMoveFiles(event) {
    if (event.success) {
      if (event.removeFromUI) {
        this.actions.objectsToMove.map((objectToMove, i) => {
          this.objects.splice(this.objects.indexOf(objectToMove), 1)
        })
        this.actions.selectedObjectsCount -= this.actions.objectsToMove.length
      } else {
        this.objects.map((object, index) => {
          object.isSelected = false
          return object
        })
        this.actions.selectedObjectsCount = 0
      }
      this.toastr.success(event.message, 'Success!');
    } else {
      if (event.message !== undefined) {
        if (event.message !== undefined) {
          this.toastr.error(event.message)
        }
      }
    }
    this.hideMoveObjectsModal()
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

  browseFolder(folderName, onEditMode) {
    if (onEditMode) {
      return
    }
    const path = this.currentPath + folderName + '/'
    this.router.navigate(['buckets', this.bucketName], { queryParams: { path: path } })
  }

  // Show Modals

  showManagePermissionsModal(index) {
    this.actions.objectForPermissions = this.objects[index]
    this.modalStates.permissions = true
  }

  showManageMetaModal(index) {
    this.actions.objectForMeta = this.objects[index]
    this.modalStates.meta = true
  }

  showMoveObjectsModal() {

    if (this.user['role'] == 'user') {
      this.toast.warning("You don't have permission to perform that action")
      return;
    }

    this.modalStates.moveFiles = true
  }

  showShareObjectModal(index) {
    this.actions.objectToShare = this.objects[index]
    this.modalStates.share = true
  }

  showDeleteModal(i) {
    this.actions.objectsToDelete = []
    this.actions.objectsToDelete.push(this.objects[i])
    this.modalStates.delete = true
  }

  showDeletesModel() {

    if (this.user['role'] == 'user') {
      this.toast.warning("You don't have permission to perform that action")
      return false;
    }

    this.actions.objectsToDelete = []
    this.modalStates.delete = true
    this.objects.map((object, index) => {
      if (object.isSelected) {
        this.actions.objectsToDelete.push(object)
      }
    })
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

  hidePermissionsModal(event) {

    if (event.success) {
      this.toastr.success('Success')
    } else {
      if (event.message !== undefined) {
        this.toastr.error(event.message)
      }
    }

    this.modalStates.permissions = false
  }

  hideManageMetaModal(event) {
    if (event.success) {
      this.toastr.success('Success')
    } else {
      if (event.message !== undefined) {
        this.toastr.error(event.message)
      }
    }
    this.modalStates.meta = false
  }

  hideMoveObjectsModal() {
    this.modalStates.moveFiles = false
    this.actions.objectsToMove = []
  }

  hideShareObjectModal(event) {
    if (event.success) {
      this.toastr.success('Success')
    } else {
      if (event.message !== undefined) {
        this.toastr.error(event.message)
      }
    }
    this.modalStates.share = false
  }

  createNewFolder() {

    if (this.user['role'] == 'user') {
      this.toast.warning("You don't have permission to perform that action")
      return false;
    }

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

    if (event.keyCode === 27) {
      this.objects[i].onEditMode = false
      this.objects[i].name = this.objects[i].originalName
    }

    if (event.keyCode === 13) {

      if (this.objectNameBeforeRenaming === '') {

        if (this.objects[i].name === '') {
          this.toastr.warning('Enter New Folder Name')
          return false;
        }

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

        this.objects[i].originalName = this.objects[i].name

        const renameObject = {
          bucketName: this.bucket.bucketName,
          paths: [this.currentPath + this.objectNameBeforeRenaming],
          dest: this.currentPath + this.objects[i].name
        }

        this.mainService.moveObjects(renameObject).subscribe((renameObjectStatus: any) => {
          if (renameObjectStatus.success) {
            this.closeFolderEditMode(i);
            this.toastr.success('Renamed Sucessfully', 'Success!')

            const objectToSearch = {
              bucketName: this.bucket.bucketName,
              path: this.currentPath,
              name: this.objects[i].name
            }

            this.mainService.searchObjects(objectToSearch).subscribe((res: any) => {

              const object = res.objects[0]

              this.objects[i].name = object.name
              this.objects[i].size = object.size
              this.objects[i].items = object.items
              this.objects[i].createdAt = object.createdAt
              this.objects[i].modifiedAt = object.modifiedAt
              this.objects[i].objectType = object.objectType

            })

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

  getObjectsPushToUI(name, isFolder, currentFolderName) {

    const objectToSearch = {
      bucketName: this.bucket.bucketName,
      path: this.currentPath,
      name: name
    }

    if (isFolder) {
      const object = {
        name: currentFolderName,
        objectType: 'folder',
        size: 0,
        createdAt: new Date(),
        modifiedAt: new Date()
      }
      return this.objects.unshift(object)
    }

    this.mainService.searchObjects(objectToSearch).subscribe((res: any) => {
      this.objects.push({ ...res.objects[0], onEditMode: false })
    })
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

    const fileLength = file.size;

    let uploadFilePath = ''
    let isFolder = false
    let currentFolderName = ''

    if (file.webkitRelativePath) {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.webkitRelativePath}`
      isFolder = true
      currentFolderName = file.webkitRelativePath.split('/')[0]
    } else if (file.mozRelativePath) {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.mozRelativePath}`
      isFolder = true
      currentFolderName = file.mozRelativePath.split('/')[0]
    } else {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.name}`
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${this.API_URL}/bucket/objects/${uploadFilePath}`, true);
    xhr.upload.onprogress = function (e) {
      const percentComplete = Math.ceil((e.loaded / e.total) * 100);
    };

    xhr.onload = function () {
      if (this.status === 200) {
        self.toast.success('', 'File Uploaded')
        self.getObjectsPushToUI(file.name, isFolder, currentFolderName)
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

  toggleRefresh() {
    document.getElementById('toggleRefresh2').style.animation = 'rotation 1s 1 linear';
    this.getObjects();
  }

  getObjects() {

    const objectToSearch = {
      bucketName: this.bucket.bucketName,
      path: this.currentPath
    }

    this.mainService.searchObjects(objectToSearch).subscribe((searchObjectResponse: any) => {
      if (searchObjectResponse.success) {
        this.objects = searchObjectResponse.objects
      }
    })

  }


}
