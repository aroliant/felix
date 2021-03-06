import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-modal-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {

  @Input() show: Boolean;
  @Input() object: any;
  @Input() bucket: any;
  @Input() currentPath;
  @Output() onHide = new EventEmitter<any>();

  data = {
    bucketName: '',
    path: '',
    fileName: '',
    meta: {
      'Content-Type': '',
      'Cache-Control': '',
      'Content-Encoding': '',
      'Content-Disposition': ''
    }
  }

  metaArray = []

  constructor(private mainService: MainService) { }

  ngOnInit() {

  }

  addInMetaArray() {
    this.metaArray.push({
      'key': '',
      'value': ''
    })
  }

  removeMeta(index) {
    this.metaArray.splice(index, 1)
  }

  updateObjectMeta() {

    this.data.bucketName = this.bucket.bucketName
    this.data.path = this.currentPath
    this.data.fileName = this.object['name']

    const data = this.data
    this.metaArray.map((meta, i) => {
      data.meta[meta.key] = meta.value
    })

    this.mainService.updateObjectMeta(data).subscribe((updateMetaResponse: any) => {
      this.data.meta['Content-Type'] = ''
      this.data.meta['Cache-Control'] = ''
      this.data.meta['Content-Encoding'] = ''
      this.data.meta['Content-Disposition'] = ''
      this.metaArray = []
      this.onHide.emit(updateMetaResponse)
    })

  }

  hideModal() {
    this.onHide.emit({ success: false })
  }

}
