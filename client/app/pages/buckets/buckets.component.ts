import { Component, OnInit } from '@angular/core';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.scss']
})
export class BucketsComponent implements OnInit {

  constructor(private mainService : MainService) { }

  buckets = []
  filteredBucekts = []

  ngOnInit() {
    this.mainService.getAllBuckets().subscribe((res:any) => {
      this.buckets = res.buckets;
      this.filteredBucekts = this.buckets;
    })
  }

}
