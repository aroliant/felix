import { Component } from '@angular/core';
import { MainService } from './services/main.service';
import { environment } from 'client/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'felix';

  constructor(private service: MainService) {
    this.service.getGlobalSettings().subscribe((res: any) => {
      environment.API_URL = res.PRIMARY_DOMAIN ? res.PRIMARY_DOMAIN : environment.API_URL
      console.log('environment', environment.API_URL)
    })
  }
}
