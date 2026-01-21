import { Component, effect, inject } from '@angular/core';
import { ChatComponent } from "./chat/chat.component";
import { PollComponent } from "./poll/poll.component";
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../shared/services/layout/layout.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ApiService } from '../../shared/services/api/api.service';
import { Subject } from 'rxjs';
import { NewPollComponent } from "./new-poll/new-poll.component";
import { SideMenu } from '../../core/types/activepage';
import { AuthResponse } from '../../core/types/core.type';
import { Poll } from '../../core/types/poll.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-page',
  imports: [ChatComponent, PollComponent, CommonModule, NewPollComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {

  layoutSer = inject(LayoutService);
  authSer = inject(AuthService);
  api = inject(ApiService);
  route = inject(ActivatedRoute);

  pollDataResponse: AuthResponse<Poll> = this.route.snapshot.data['poll'];
  isPollSelected: boolean = true;

  private destroy$ = new Subject<void>();


  ngOnInit() {

    if (!this.pollDataResponse) {
      this.isPollSelected = false;
    }


    this.authSer.authenticateUser().subscribe({
      next: (res) => {
        this.authSer.setCurrentUser(res.data);
      }
    });

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor() {
    effect(() => {
      this.activePage = this.layoutSer.activeView();
      this.isMobile = this.layoutSer.isMobileView();

    });
  }

  isMobile = window.innerWidth < 768;
  activePage: SideMenu = 'poll';

}
