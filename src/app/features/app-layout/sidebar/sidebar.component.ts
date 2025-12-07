import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout/layout.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api/api.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ListPoll } from '../../../core/types/poll.model';

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
  pollList: ListPoll[] = [];
  destroy$ = new Subject<void>();

  get isCollapsed() {
    return this.layout.isCollapsed;
  }

  ngOnInit() {

    this.getPollLists();
    this.api.$pollObserver
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.layout.toggleSidebar();
          }
        }
      })
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

  openPoll(pollId: string) {
    
    this.api.fetchPoll(pollId).subscribe({
      next: (res) => {
        this.api.selectPoll(res.data);
      }
    })
  }


}
