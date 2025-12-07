import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }

  isCollapsed = false;

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


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }


}
