import { Component, OnInit } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  createBucket() {
    this.mainService.createBucket(this.bucket).subscribe((bucketCreationStatus: any) => {
      if (bucketCreationStatus.success) {
        this.toastr.success(bucketCreationStatus.message, 'Success!')
      } else {
        this.toastr.error(bucketCreationStatus.message)
      }
    })
  }

}
