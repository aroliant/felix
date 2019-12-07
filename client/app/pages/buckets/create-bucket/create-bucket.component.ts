import { Component, OnInit } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-bucket',
  templateUrl: './create-bucket.component.html',
  styleUrls: ['./create-bucket.component.scss']
})
export class CreateBucketComponent implements OnInit {

  bucket = {
    bucketName: '',
    userID: 'USR0000001',
    fileListing: 'restricted'
  }

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  createBucket() {

    if (this.bucket.bucketName == '') {
      this.toastr.warning('Enter Bucket Name')
      return false
    }

    this.mainService.createBucket(this.bucket).subscribe((bucketCreationStatus: any) => {
      if (bucketCreationStatus.success) {
        this.toastr.success(bucketCreationStatus.message, 'Success!')
        this.router.navigate(['buckets', this.bucket.bucketName])
      } else {
        this.toastr.error(bucketCreationStatus.message)
      }
    })
  }

}
