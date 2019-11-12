import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor() {
  }

  copyToClipboard(string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (string));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}
