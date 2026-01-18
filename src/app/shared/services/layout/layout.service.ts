import { Injectable, signal } from '@angular/core';
import { SideMenu } from '../../../core/types/activepage';
import { ListPoll } from '../../../core/types/poll.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }

  isCollapsed = false;

  private isMobile = window.innerWidth < 768;

  activeView = signal<SideMenu>('poll');
  isMobileView = signal<boolean>(this.isMobile);
  sidePollsMenu = signal<ListPoll | null>(null);

  toggleChat(view: SideMenu) {
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
