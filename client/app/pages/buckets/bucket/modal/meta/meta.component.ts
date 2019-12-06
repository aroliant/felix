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
    this.show = false
  }

}
