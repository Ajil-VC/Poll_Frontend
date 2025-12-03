import { Component, effect, inject } from '@angular/core';
import { ChatComponent } from "./chat/chat.component";
import { PollComponent } from "./poll/poll.component";
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../shared/services/layout/layout.service';
import { AuthService } from '../../shared/services/auth/auth.service';


@Component({
  selector: 'app-page',
  imports: [ChatComponent, PollComponent, CommonModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {

  layoutSer = inject(LayoutService);
  authSer = inject(AuthService);

  ngOnInit() {
    this.authSer.authenticateUser().subscribe({
      next: (res) => {
        this.authSer.setCurrentUser(res.data);
      }
    })
  }
  
  constructor() {
    effect(() => {
      this.activePage = this.layoutSer.activeView();
      this.isMobile = this.layoutSer.isMobileView();

    });
  }



  isMobile = window.innerWidth < 768;
  activePage: 'chat' | 'poll' = 'poll';

}
