import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-bucket-settings',
  templateUrl: './bucket-settings.component.html',
  styleUrls: ['./bucket-settings.component.scss']
})
export class BucketSettingsComponent implements OnInit {

  bucket = {
    bucketName: ''
  }
  deleteConfirmationBucketName = ''

  constructor(private route: ActivatedRoute,private mainService: MainService,private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.bucket.bucketName = params.bucketName
    })

  }

  openFileListingPrivacy() {
    document.getElementById("FileListingPrivacy").style.display = "flex";
  }
  closeFileListingPrivacy() {
    document.getElementById("FileListingPrivacy").style.display = "none";
  }

  openDeleteBucketModal() {
    this.deleteConfirmationBucketName = ''
    document.getElementById("DeleteBucketModal").style.display = "block";
  }
  closeDeleteBucketModal() {
    document.getElementById("DeleteBucketModal").style.display = "none";
  }
  deleteBucket() {
    console.log(this.deleteConfirmationBucketName + ' === ' + this.bucket.bucketName)
    if(this.deleteConfirmationBucketName === this.bucket.bucketName){
      this.mainService.deleteBucket(this.bucket.bucketName).subscribe((deleteBucketStatus:any) => {
        if(deleteBucketStatus.success){
          this.closeDeleteBucketModal();
          console.log(deleteBucketStatus.message)
          this.router.navigate(['buckets'])
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
