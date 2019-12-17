import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from 'client/app/services/auth.service';

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
  API_URL = environment.API_URL

  user = {}

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.user = this.authService.getUser()
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
