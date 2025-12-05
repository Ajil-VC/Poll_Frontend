import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Poll } from '../../../core/types/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthResponse } from '../../../core/types/core.type';
import { ApiService } from '../../../shared/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../../shared/services/socket/socket.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent {

  api = inject(ApiService);
  route = inject(ActivatedRoute);
  toast = inject(ToastrService);
  socket = inject(SocketService);

  private subscriptions: Subscription[] = [];

  private destroy$ = new Subject<void>();

  pollDataResponse: AuthResponse<Poll> = this.route.snapshot.data['poll'];
  selectedOptionIndex: number | null = null;
  poll!: Poll;

  ngOnInit() {

    this.poll = this.pollDataResponse.data;
    this.api.setPollId(this.poll.id);
    this.setupSocketListeners();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }

  private setupSocketListeners(): void {

    // Listen for new polls
    const pollSub = this.socket.onNewPolls().subscribe(
      (poll) => {
        this.poll = poll;
        this.pollDataResponse.data = this.poll;
      }
    );

    this.subscriptions.push(pollSub);

  }



  get totalVotes() {
    return this.poll.options.reduce((a, b) => a + b.voteCount, 0);
  }

  getPercentage(votes: number) {
    if (this.totalVotes === 0) return 0;
    return Math.round((votes / this.totalVotes) * 100);
  }

  barColors = [
    '#FF6B6B', '#4ECDC4', '#5567FF', '#FFA726',
    '#AB47BC', '#26A69A', '#EF5350', '#29B6F6'
  ];


  castVote() {
    if (this.selectedOptionIndex !== null) {
      const selectedOptionId = this.poll.options[this.selectedOptionIndex].id;
      // if (res.status) {
      //   this.poll = res.data;
      //   this.pollDataResponse.data = this.poll;
      //   this.selectedOptionIndex = this.poll.options.findIndex(item => item.id === selectedOptionId)
      //   this.toast.success(res.message);
      // }
      // this.api.giveVote(this.poll.id, selectedOptionId).subscribe({
      //   next: (res) => {

      //   },
      //   error: (err) => {
      //     this.toast.error('Voting couldnt complete');
      //   }
      // })
    }
  }

}
