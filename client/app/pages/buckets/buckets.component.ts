import { Component, OnInit } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { HelperService } from 'client/app/services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'client/app/services/auth.service';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.scss']
})
export class BucketsComponent implements OnInit {

  buckets = []
  isDataLoaded: Boolean = false

  user = {}

  constructor(
    private mainService: MainService,
    private authService: AuthService,
    private helperService: HelperService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.user = this.authService.getUser()
    this.mainService.getAllBuckets().subscribe((res: any) => {
      this.buckets = res.buckets;
      this.isDataLoaded = true
    })
    this.buckets.map((bucket, i) => {
      bucket['showMenu'] = false
    })
  }

  toggleMenu(index) {
    this.buckets[index].showMenu = !this.buckets[index].showMenu
  }

  copyToClipboard(string) {
    this.helperService.copyToClipboard(string)
  }

}
