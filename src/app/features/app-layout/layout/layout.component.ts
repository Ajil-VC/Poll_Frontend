import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ChatComponent } from "../../page/chat/chat.component";
import { PollComponent } from "../../page/poll/poll.component";

@Component({
  selector: 'app-layout',
  imports: [CommonModule, HeaderComponent, ChatComponent, PollComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  isMobile = window.innerWidth < 768;
  activePage: 'chat' | 'poll' = 'poll';

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleChat = (view: 'poll' | 'chat') => {
    this.activePage = view;
  }

}
