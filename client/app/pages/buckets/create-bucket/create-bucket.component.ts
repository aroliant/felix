import { Component, OnInit } from '@angular/core';
import { MainService } from 'client/app/services/main.service';

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

  constructor(private mainService: MainService) { }

  ngOnInit() {
  }

  createBucket() {
    this.mainService.createBucket(this.bucket).subscribe((bucketCreationStatus:any) => {
      if(bucketCreationStatus.success){
        console.log(bucketCreationStatus.message)
      }
    })
  }

}
