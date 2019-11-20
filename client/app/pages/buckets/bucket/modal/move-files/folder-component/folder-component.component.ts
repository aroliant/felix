import { Component, Input, } from '@angular/core';

  export interface Branch {
  name: string;
  relativePath: string,
  type: string,
  isSymbolicLink: boolean,
  size: string,
  children: Branch[];
}

@Component({
  selector: 'folders',
  templateUrl: './folder-component.component.html',
})
export class FoldersComponent{

  @Input() branch: Branch

}
