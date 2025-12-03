import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Poll } from '../../../core/types/poll.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthResponse } from '../../../core/types/core.type';
import { ApiService } from '../../../shared/services/api/api.service';
import { ToastrService } from 'ngx-toastr';

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
  pollDataResponse: AuthResponse<Poll> = this.route.snapshot.data['poll'];
  poll!: Poll;

  ngOnInit() {

    this.poll = this.pollDataResponse.data;
    this.api.setPollId(this.poll.id);
  }

  selectedOptionIndex: number | null = null;

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
      this.api.giveVote(this.poll.id, selectedOptionId).subscribe({
        next: (res) => {

          if (res.status) {
            this.poll = res.data;
            this.pollDataResponse.data = this.poll;
            this.selectedOptionIndex = this.poll.options.findIndex(item => item.id === selectedOptionId)
            this.toast.success(res.message);
          }
        },
        error: (err) => {
          this.toast.error('Voting couldnt complete');
        }
      })
    }
  }

}
