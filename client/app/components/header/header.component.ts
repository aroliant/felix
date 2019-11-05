import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {



  }


  openSearchOverlay() {
    document.getElementById("HeaderTopSearch__contentOverlay").style.display = "block";
  }
  openSearchMenu() {
    document.getElementById("HeaderTopSearch__content").style.display = "block";
  }
}
