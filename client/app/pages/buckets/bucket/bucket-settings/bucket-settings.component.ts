import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bucket-settings',
  templateUrl: './bucket-settings.component.html',
  styleUrls: ['./bucket-settings.component.scss']
})
export class BucketSettingsComponent implements OnInit {

  bucket = {
    bucketName: ''
  }

  constructor(private route: ActivatedRoute) { }

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
    document.getElementById("DeleteBucketModal").style.display = "block";
  }
  closeDeleteBucketModal() {
    document.getElementById("DeleteBucketModal").style.display = "none";
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
