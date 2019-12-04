import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-modal-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  @Input() show: Boolean;
  @Input() object: {};
  @Input() bucket: any;
  @Input() currentPath;
  @Output() onHide = new EventEmitter<boolean>();

  data = {
    bucketName: '',
    path: '',
    fileName: '',
    public: true
  }

  constructor(private mainService: MainService) { }

  ngOnInit() { }

  setPrivacyPrivate() { this.data.public = false }

  setPrivacyPublic() { this.data.public = true }

  updatePermission() {

    this.data.bucketName = this.bucket.bucketName
    this.data.bucketName = this.currentPath
    this.data.fileName = this.object['name']

    this.mainService.updateObjectPermission(this.data).subscribe((updatePermissionResponse: any) => {
      this.bucket.onHide.emit(updatePermissionResponse)
    })

  }

  hideModal() {
    this.show = false
    this.onHide.emit(false)
  }

}
