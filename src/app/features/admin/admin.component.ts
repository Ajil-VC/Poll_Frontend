import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { Poll } from '../../core/types/poll.model';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {


  showForm = false;
  api = inject(ApiService);
  toast = inject(ToastrService);

  polls: Poll[] = [];

  newPoll = {
    question: "",
    options: [""]
  };

  ngOnInit() {

    this.api.getAllPolls().subscribe({
      next: (res) => {

        if (res.status) {
          this.polls = res.data;
        }
      },
      error: (err) => {
        this.toast.error('Something went wrong while fetching data');
      }
    })
  }

  addOption() {
    this.newPoll.options.push("");
  }

  removeOption(i: number) {
    this.newPoll.options.splice(i, 1);
  }

  createPoll() {

    const createdPoll = {
      question: this.newPoll.question,
      options: this.newPoll.options.map(o => ({ text: o, voteCount: 0 })),
    };

    this.api.createPoll(this.newPoll.question, this.newPoll.options).subscribe({

      next: (res) => {
        console.log(res);
        if (res.status) {
          this.polls.push(res.data);
        }
      },
      error: (err) => {
        this.toast.error(err);
      }
    })


    // Reset
    this.newPoll = { question: "", options: [""] };
    this.showForm = false;
  }

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    alert("URL copied!");
  }


  trackByIndex(index: number) {
    return index;
  }

}
