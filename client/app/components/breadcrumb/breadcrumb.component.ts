import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {

  @Input() bucket: any

  isFilesTabActive = false

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

  }

  navigateToRoot(bucketName) {
    this.router.navigate([`/buckets/${bucketName}`], { queryParams: { path: '/' } })
  }

  ngOnChanges() {
    if (!this.bucket) { return }

    if (location.pathname === '/buckets/' + this.bucket.bucketName) {
      this.isFilesTabActive = true
    } else {
      this.isFilesTabActive = false
    }
  }

}
