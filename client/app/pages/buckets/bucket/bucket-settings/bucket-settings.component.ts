import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'client/app/services/main.service';
import { HelperService } from 'client/app/services/helper.service';
import { ToastrService } from 'ngx-toastr';

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
    }
  }
  deleteConfirmationBucketName = ''

  constructor(private route: ActivatedRoute,
    private mainService: MainService,
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
    this.toastr.success('Copied to Clipboard')
  }

  openFileListingPrivacy() {
    document.getElementById("FileListingPrivacy").style.display = "flex";
  }
  closeFileListingPrivacy() {
    document.getElementById("FileListingPrivacy").style.display = "none";
  }

  saveAndCloseFileListingPrivacy() {
    var bucket = {
      bucketID: this.bucket.bucketID,
      settings: {
        fileListing: this.bucket.settings.fileListing
      }
    }
    this.mainService.updateBucket(bucket).subscribe((updateBucketResult: any) => {
      if (updateBucketResult.success) {
        this.toastr.success(updateBucketResult.message, 'Success!')
      } else {
        this.toastr.error(updateBucketResult.message)
      }
    })
  }

  openDeleteBucketModal() {
    this.deleteConfirmationBucketName = ''
    document.getElementById("DeleteBucketModal").style.display = "block";
  }
  closeDeleteBucketModal() {
    document.getElementById("DeleteBucketModal").style.display = "none";
  }

  openPurgeModal() {
    this.deleteConfirmationBucketName = ''
    document.getElementById("PurgeModal").style.display = "block";
  }
  closePurgeModal() {
    document.getElementById("PurgeModal").style.display = "none";
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

  openCORSoptionModal() {
    document.getElementById("CORSoptionModal").style.display = "block";
  }
  closeCORSoptionModal() {
    document.getElementById("CORSoptionModal").style.display = "none";
  }

  addHeaderCORS() {
    document.getElementById("HeaderCORS").style.display = "flex";
  }
  removeHeaderCORS() {
    document.getElementById("HeaderCORS").style.display = "none";
  }

}
