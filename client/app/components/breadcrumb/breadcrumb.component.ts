import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges, OnDestroy {

  @Input() bucket: any
  @Input() clickOutside: Observable<void>;
  private clickOutsideSubscription: Subscription;

  isFilesTabActive = false

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // this.clickOutsideSubscription = this.clickOutside.subscribe(() => {
    //   // Click Outside Event
    // })
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

  ngOnDestroy() {
    // this.clickOutsideSubscription.unsubscribe();
  }

}
