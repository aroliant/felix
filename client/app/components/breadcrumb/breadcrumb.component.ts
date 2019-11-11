import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {

  @Input() bucket: any

  isFilesTabActive = false

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

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
