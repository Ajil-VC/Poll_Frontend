import { Component, effect, inject } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout/layout.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api/api.service';
import { Subject } from 'rxjs';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ListPoll } from '../../../core/types/poll.model';
import { SocketService } from '../../../shared/services/socket/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SideMenu } from '../../../core/types/activepage';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  layout = inject(LayoutService);
  api = inject(ApiService);
  auth = inject(AuthService);
  socket = inject(SocketService);
  router = inject(Router);
  route = inject(ActivatedRoute)
  pollList: ListPoll[] = [];
  destroy$ = new Subject<void>();

  isPolls: boolean = false;

  get isCollapsed() {
    return this.layout.isCollapsed;
  }

  constructor() {

    effect(() => {

      const poll = this.layout.sidePollsMenu();
      if (poll) {
        this.pollList.push(poll);
      }
    })
  }

  ngOnInit() {

    this.getPollLists();

  }
  ngOnDestroy() {

    this.destroy$.next();
    this.destroy$.complete();
  }


  getPollLists() {
    this.api.getUserPolls().subscribe({
      next: (res) => {
        if (res.status) {
          this.pollList = res.data;
        }
      }
    })
  }

  openPage(view: SideMenu) {
    this.layout.toggleChat(view);
    if (this.layout.isCollapsed) {

      this.layout.toggleSidebar();
    }
  }


  showPolls() {
    this.isPolls = !this.isPolls;
  }
  openPoll(pollId: string) {

    this.router.navigate(['/app/home', pollId]);
    this.socket.join(pollId);
    this.layout.toggleChat('poll');
    this.layout.toggleSidebar();
  }


  logout() {
    this.auth.logout();
  }
}
