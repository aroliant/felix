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
  directories = []
  files = []
  filteredDirectories = []
  filteredFiles = []

  constructor(private route: ActivatedRoute, private mainService: MainService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.bucketName = params.bucketName;
      this.mainService.getBucket(this.bucketName).subscribe((res: any) => {
        if (res.success) {
          this.bucket = res.bucket;
          const filters = {
            bucketName: this.bucket['bucketName'],
            path: this.currentPath
          }
          this.mainService.searchObjects(filters).subscribe((res: any) => {
            this.objects = res.objects
            this.objects.map((object,i) => {
              if(object.objectType == 'folder'){
                this.directories.push(object)
              }
              else if(object.objectType == 'file'){
                this.files.push(object)
              }
            })
            this.filteredDirectories = this.directories
            this.filteredFiles = this.files
          })
        }
      });
    })
  }

  searchFilter() {
    if(this.searchInput === ''){
      this.filteredDirectories = this.directories
      this.filteredFiles = this.files
    }else{
      this.filteredDirectories = []
      this.filteredFiles = []
      this.directories.map((directory,i) => {
        if(directory.name.includes(this.searchInput))
        this.filteredDirectories.push(directory)
      })
      this.files.map((file,i)=>{
        if(file.name.includes(this.searchInput))
        this.filteredFiles.push(file)
      })
    }
  }

  deleteFile(index){
    var object = {
      paths: [],
      bucketName: this.bucketName
    }
    object.paths.push(this.currentPath+'/'+this.filteredFiles[index].name)
    this.mainService.deleteObjects(object).subscribe((res:any) => {
      if(res.success){
        for(var i=0;i<this.files.length;i++){
          if(this.files[i].name === this.filteredFiles[index].name){
            this.files.splice(i,1)
            break;
          }
        }
        this.filteredFiles.splice(index, 1)
      }
    })
  }

  deleteFolder(index){
    var object = {
      paths: [],
      bucketName: this.bucketName
    }
    object.paths.push(this.currentPath+'/'+this.filteredDirectories[index].name+'/')
    this.mainService.deleteObjects(object).subscribe((res:any) => {
      if(res.success){
        for(var i=0;i<this.files.length;i++){
          if(this.directories[i].name === this.filteredDirectories[index].name){
            this.directories.splice(i,1)
            break;
          }
        }
        this.filteredDirectories.splice(index, 1)
      }
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

  openUploadFilesModal() {
    document.getElementById("UploadFilesModal").style.display = "block";
  }
  closeUploadFilesModal() {
    document.getElementById("UploadFilesModal").style.display = "none";
  }

  openUploadFoldersModal() {
    document.getElementById("UploadFoldersModal").style.display = "block";
  }
  closeUploadFoldersModal() {
    document.getElementById("UploadFoldersModal").style.display = "none";
  }


  openManagePermissionModal() {
    document.getElementById("ManagePermissionModal").style.display = "block";
  }
  closeManagePermissionModal() {
    document.getElementById("ManagePermissionModal").style.display = "none";
  }

  openManageMetaModal() {
    document.getElementById("ManageMetaModal").style.display = "block";
  }
  closeManageMetaModal() {
    document.getElementById("ManageMetaModal").style.display = "none";
  }

  showManageMeta__custompairing() {
    document.getElementById("ManageMeta__custompairing").style.display = "flex";
  }
  hideManageMeta__custompairing() {
    document.getElementById("ManageMeta__custompairing").style.display = "none";
  }

  openMoveItemModal() {
    document.getElementById("MoveItemModal").style.display = "flex";
  }
  closeMoveItemModal() {
    document.getElementById("MoveItemModal").style.display = "none";
  }

  openShareItemModal() {
    document.getElementById("ShareItemModal").style.display = "flex";
  }
  closeShareItemModal() {
    document.getElementById("ShareItemModal").style.display = "none";
  }

}
