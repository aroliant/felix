import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  // close search and overlay
  closeSearchAndOverlay() {
    document.getElementById("HeaderTopSearch__content").style.display = "none";
    document.getElementById("HeaderTopSearch__contentOverlay").style.display = "none";
  }

}
