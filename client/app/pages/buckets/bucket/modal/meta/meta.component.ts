import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-modal-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {

  @Input() show: Boolean;
  @Input() object: {};
  @Input() bucket: any;
  @Input() currentPath;
  @Output() onHide = new EventEmitter<boolean>();

  data = {
    bucketName: '',
    path: '',
    fileName: '',
    meta: {
      "Content-Type": "",
      "Cache-Control": '',
      "Content-Encoding": '',
      "Content-Disposition": ""
    }
  }

  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.data.meta['Content-Type']= ""
    this.data.meta['Cache-Control']= ""
    this.data.meta['Content-Encoding']= ""
    this.data.meta['Content-Disposition']= ""
  }

  updateObjectMeta() {

    this.data.bucketName = this.bucket.bucketName
    this.data.bucketName = this.currentPath
    this.data.fileName = this.object['name']

    this.mainService.updateObjectMeta(this.data).subscribe((updateMetaResponse: any) => {
      this.onHide.emit(updateMetaResponse)
    })

  }

  hideModal() {
    this.show = false
  }

}
