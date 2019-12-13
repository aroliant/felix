import { Component, Input, OnChanges, OnInit, } from '@angular/core';
import Bus from '../../../../../../../app/services/Bus.service';

export interface Branch {
  name: string;
  relativePath: string,
  type: string,
  isSymbolicLink: boolean,
  size: string,
  children: Branch[];
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'folders',
  templateUrl: './folder-component.component.html',
})
export class FoldersComponent implements OnInit {

  @Input() branch: Branch

  ngOnInit() {
    this.branch['open'] = false
  }

  selectFolder(folder) {
    // Broadcast to Move Files Component
    Bus.FILE_MOV_PATH = folder
    this.branch['open'] = true
  }



}
