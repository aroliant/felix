import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-move-files',
  templateUrl: './move-files.component.html',
  styleUrls: ['./move-files.component.scss']
})
export class MoveFilesComponent implements OnInit {

  @Input() show: Boolean;
  @Input() objects: [];
  @Input() bucket: any;
  @Input() currentPath;
  @Output() onHide = new EventEmitter<boolean>();

  constructor(private mainService: MainService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  moveObjects() {
    var moveObjects = {}
    
    this.mainService.moveObjects(moveObjects).subscribe((moveObjectsStatus: any) => {
      if (moveObjectsStatus.success) {
        this.toastr.success(moveObjectsStatus.message, 'Success!')
      } else {
        this.toastr.error(moveObjectsStatus.message)
      }
    })
  }

  hideModal() {
    this.show = false
    this.onHide.emit(false)
  }
}
