import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { HelperService } from 'client/app/services/helper.service';

@Component({
  selector: 'app-modal-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  @Input() show: Boolean;
  @Input() object: any;
  @Input() bucket: any;
  @Input() currentPath;
  @Output() onHide = new EventEmitter<boolean>();

  expireTime = 0

  constructor(private mainService: MainService, private helperService: HelperService) { }

  ngOnInit() {
    Date.prototype['addHours'] = function (h) {
      this.setHours(this.getHours() + h);
      return this;
    }
  }

  copyToClipBoard(path) {
    this.helperService.copyToClipboard(path)
  }

  shareObject() {

    const now = new Date();

    const data = {
      bucketName: this.bucket.bucketName,
      path: this.currentPath,
      fileName: this.object['name'],
      sharingExpiresOn: now.setHours(now.getHours() + this.expireTime).toString()
    }

    this.mainService.shareObject(data).subscribe((shareObjectResponse: any) => {
      this.onHide.emit(shareObjectResponse)
    })
  }

  hideModal() {
    this.show = false
  }
}
