import { Component, OnInit } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { HelperService } from 'client/app/services/helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.scss']
})
export class BucketsComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private helperService: HelperService,
    private toastr: ToastrService
  ) { }

  buckets = []

  ngOnInit() {
    this.mainService.getAllBuckets().subscribe((res: any) => {
      this.buckets = res.buckets;
    })
  }

  copyToClipboard(string) {
    this.helperService.copyToClipboard(string)
    this.toastr.success('Copied to Clipboard');
  }

}
