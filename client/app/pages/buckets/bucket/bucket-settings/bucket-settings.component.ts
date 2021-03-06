import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'client/app/services/main.service';
import { HelperService } from 'client/app/services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { AuthService } from 'client/app/services/auth.service';

@Component({
  selector: 'app-bucket-settings',
  templateUrl: './bucket-settings.component.html',
  styleUrls: ['./bucket-settings.component.scss']
})
export class BucketSettingsComponent implements OnInit {

  bucket = {
    bucketName: '',
    bucketID: '',
    settings: {
      fileListing: ''
    },
    domains: [],
    cors: [{
      origin: '',
      allowedMethods: [],
      allowedHeaders: [],
      accessControlMaxAge: 0
    }]
  }
  deleteConfirmationBucketName = ''
  newCORS = {
    origin: '',
    allowedMethods: [],
    allowedHeaders: [],
    accessControlMaxAge: 0
  }
  editCORSIndex = -1
  newDomain = {
    name: '',
    sslEnabled: false,
    forceSSL: false
  }

  isEditOriginNameValid = true

  user = {}

  API_URL = environment.API_URL

  constructor(private route: ActivatedRoute,
    private mainService: MainService,
    private authService: AuthService,
    private router: Router,
    private helperService: HelperService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.subscribe((params) => {
      this.bucket.bucketName = params.bucketName
      this.mainService.getBucket(this.bucket.bucketName).subscribe((getBucketResult: any) => {
        if (getBucketResult.success) {
          this.bucket = getBucketResult.bucket
        }
      })
    })
  }

  copyToClipboard(string) {
    this.helperService.copyToClipboard(string)
  }

  openFileListingPrivacy() {
    document.getElementById('FileListingPrivacy').style.display = 'flex';
  }
  closeFileListingPrivacy() {
    document.getElementById('FileListingPrivacy').style.display = 'none';
  }

  saveAndCloseFileListingPrivacy() {
    const bucket = {
      bucketID: this.bucket.bucketID,
      settings: {
        fileListing: this.bucket.settings.fileListing
      }
    }
    this.mainService.updateBucket(bucket).subscribe((updateBucketResult: any) => {
      if (updateBucketResult.success) {
        this.toastr.success(updateBucketResult.message, 'Success!')
        this.closeFileListingPrivacy()
      } else {
        this.toastr.error(updateBucketResult.message)
      }
    })
  }

  validateEditOrigin() {

    if (this.bucket.cors[this.editCORSIndex].origin == "") {
      this.isEditOriginNameValid = false
    } else if (/^(?!:\/\/)([a-zA-Z0-9*.]+\.)?[a-zA-Z0-9][a-zA-Z0-9*-]+\.[a-zA-Z]{2,6}?$/.test(this.bucket.cors[this.editCORSIndex].origin)) {
      this.isEditOriginNameValid = true
    } else {
      this.isEditOriginNameValid = false
    }

  }

  openDeleteBucketModal() {
    this.deleteConfirmationBucketName = ''
    document.getElementById('DeleteBucketModal').style.display = 'block';
  }
  closeDeleteBucketModal() {
    document.getElementById('DeleteBucketModal').style.display = 'none';
  }

  openPurgeModal() {
    this.deleteConfirmationBucketName = ''
    document.getElementById('PurgeModal').style.display = 'block';
  }
  closePurgeModal() {
    document.getElementById('PurgeModal').style.display = 'none';
  }

  deleteBucket() {
    if (this.deleteConfirmationBucketName === this.bucket.bucketName) {
      this.mainService.deleteBucket(this.bucket.bucketName).subscribe((deleteBucketStatus: any) => {
        if (deleteBucketStatus.success) {
          this.closeDeleteBucketModal();
          this.toastr.success(deleteBucketStatus.message, 'Success!')
          this.router.navigate(['buckets'])
        } else {
          this.toastr.error(deleteBucketStatus.message)
        }
      })
    }
  }

  addNewHeaderOnEnter(event) {
    if (event.keyCode === 13) {
      this.addHeaderCORS();
    }
  }

  editAddNewHeaderOnEnter(event) {
    if (event.keyCode === 13) {
      this.editHeaderCORS();
    }
  }

  newCORSMethod(event) {
    if (event.target.checked === true) {
      this.newCORS.allowedMethods.push(event.target.value)
    } else {
      this.newCORS.allowedMethods.splice(this.newCORS.allowedMethods.indexOf(event.target.value), 1)
    }
  }

  newCORSHeaders(event) {
    if (event.keyCode === 13) {
      if (this.newCORS.allowedHeaders.indexOf(event.target.value) === -1) { }
    }
  }

  editCORSMethod(event) {
    if (event.target.checked === true) {
      this.bucket.cors[this.editCORSIndex].allowedMethods.push(event.target.value)
    } else {
      const index = this.bucket.cors[this.editCORSIndex].allowedMethods.indexOf(event.target.value)
      this.bucket.cors[this.editCORSIndex].allowedMethods.splice(index, 1)
    }
  }

  editCORSHeaders(event) {
    if (event.keyCode === 13) {
      if (this.newCORS.allowedHeaders.indexOf(event.target.value) === -1) { }
    }
  }

  addDomainOnEnter(event) {
    if (event.keyCode === 13) {
      this.updateDomain();
    }
  }

  updateDomainProperties() {
    this.mainService.updateBucket(this.bucket).subscribe((updateBucketStatus: any) => {
      if (updateBucketStatus.success) {
        this.newDomain = {
          name: '',
          sslEnabled: false,
          forceSSL: false
        }
        this.toastr.success(updateBucketStatus.message, 'Success!')
      } else {
        this.toastr.error(updateBucketStatus.message)
      }
    })
  }

  updateDomain() {
    if (this.newDomain.name == '') {
      this.toastr.warning('Enter Domain Name')
      return false;
    }
    this.bucket.domains.push(this.newDomain)
    this.mainService.updateBucket(this.bucket).subscribe((updateBucketStatus: any) => {
      if (updateBucketStatus.success) {
        this.newDomain = {
          name: '',
          sslEnabled: false,
          forceSSL: false
        }
        this.toastr.success(updateBucketStatus.message, 'Success!')
      } else {
        this.toastr.error(updateBucketStatus.message)
      }
    })
  }

  removeDomain(index) {
    this.bucket.domains.splice(index, 1)
    this.mainService.updateBucket(this.bucket).subscribe((domainRemovalStatus: any) => {
      if (domainRemovalStatus.success) {
        this.toastr.success(domainRemovalStatus.message, 'Success!')
      } else {
        this.toastr.error(domainRemovalStatus.message)
      }
    })
  }

  addCORS() {
    if (this.newCORS.origin == '') {
      this.toastr.warning('Enter Origin')
      return false;
    }
    this.newCORS.allowedHeaders.map((allowedHeader, i) => {
      if (allowedHeader['name'] == '') {
        this.newCORS.allowedHeaders.splice(this.newCORS.allowedHeaders.indexOf(allowedHeader), 1)
      }
    })
    this.bucket.cors.push(this.newCORS)
    this.mainService.updateBucket(this.bucket).subscribe((updateBucketStatus: any) => {
      if (updateBucketStatus.success) {
        this.newCORS = {
          origin: '',
          allowedMethods: [],
          allowedHeaders: [],
          accessControlMaxAge: 0
        }
        this.toastr.success(updateBucketStatus.message, 'Success!')
        this.closeCORSoptionModal()
      } else {
        this.toastr.error(updateBucketStatus.message)
      }
    })
  }

  removeCORS(index) {
    this.bucket.cors.splice(index, 1)
    this.mainService.updateBucket(this.bucket).subscribe((updateBucketStatus: any) => {
      if (updateBucketStatus.success) {
        this.toastr.success(updateBucketStatus.message, 'Success!')
        this.closeCORSoptionModal()
      } else {
        this.toastr.error(updateBucketStatus.message)
      }
    })
  }

  openCORSoptionModal() {
    document.getElementById('CORSoptionModal').style.display = 'block';
  }
  closeCORSoptionModal() {
    document.getElementById('CORSoptionModal').style.display = 'none';
  }

  addHeaderCORS() {
    this.newCORS.allowedHeaders.push({ name: '' })
  }

  editHeaderCORS() {
    this.bucket.cors[this.editCORSIndex].allowedHeaders.push({ name: '' })
  }

  removeHeaderCORS(index) {
    this.newCORS.allowedHeaders.splice(index, 1)
  }

  editRemoveHeaderCORS(index) {
    this.bucket.cors[this.editCORSIndex].allowedHeaders.splice(index, 1)
  }

  openEditCORSoptionModal(index) {
    this.editCORSIndex = index
    document.getElementById('editCORSoptionModal').style.display = 'block';
  }
  closeEditCORSoptionModal() {
    document.getElementById('editCORSoptionModal').style.display = 'none';
  }

  editCORSOptions() {
    if (this.bucket.cors[this.editCORSIndex].origin == '') {
      this.toastr.warning('Enter Origin')
      return false
    }
    this.bucket.cors[this.editCORSIndex].allowedHeaders.map((allowedHeader, i) => {
      if (allowedHeader['name'] == '') {
        this.bucket.cors[this.editCORSIndex].allowedHeaders.splice(this.bucket.cors[this.editCORSIndex].allowedHeaders.indexOf(allowedHeader), 1)
      }
    })
    this.mainService.updateBucket(this.bucket).subscribe((updateBucketStatus: any) => {
      if (updateBucketStatus.success) {
        this.toastr.success(updateBucketStatus.message, 'Success!')
        this.closeEditCORSoptionModal()
      } else {
        this.toastr.error(updateBucketStatus.message)
      }
    })
  }

}
