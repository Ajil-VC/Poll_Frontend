import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }

  private isMobile = window.innerWidth < 768;

  activeView = signal<'chat' | 'poll'>('poll');
  isMobileView = signal<boolean>(this.isMobile)

  toggleChat(view: 'chat' | 'poll') {
    this.activeView.set(view);
  }

  onResize(width: number) {
    if (width < 768) {
      this.isMobileView.set(true)
    } else {
      this.isMobileView.set(false);
    }
  }

}
