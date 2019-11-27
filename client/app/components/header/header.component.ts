import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router
  ) {

  }

  ngOnInit() {
  }

  logout() {

    localStorage.removeItem('token');
    this.router.navigate(['/login']);

  }


  openSearchOverlay() {
    document.getElementById("HeaderTopSearch__contentOverlay").style.display = "block";
  }
  openSearchMenu() {
    document.getElementById("HeaderTopSearch__content").style.display = "block";
  }

  // close search and overlay
  closeSearchAndOverlay() {
    document.getElementById("HeaderTopSearch__content").style.display = "none";
    document.getElementById("HeaderTopSearch__contentOverlay").style.display = "none";
  }

}
