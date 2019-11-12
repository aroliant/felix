import { Component, OnInit } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { HelperService } from 'client/app/services/helper.service';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.scss']
})
export class BucketsComponent implements OnInit {

  constructor(private mainService: MainService, private helperService: HelperService) { }

  buckets = []

  ngOnInit() {
    this.mainService.getAllBuckets().subscribe((res: any) => {
      this.buckets = res.buckets;
    })
  }

  copyToClipboard(string){
    this.helperService.copyToClipboard(string)
  }

}
