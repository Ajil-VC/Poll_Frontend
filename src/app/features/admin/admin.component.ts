import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {


  showForm = false;

  polls: any[] = [
    {
      question: "Who should be the team lead?",
      options: [
        { text: "John", voteCount: 10 },
        { text: "Emma", voteCount: 7 }
      ],
      url: "https://yourapp.com/poll/7823bdfs"
    }
  ];

  newPoll = {
    question: "",
    options: [""]
  };

  addOption() {
    this.newPoll.options.push("");
  }

  removeOption(i: number) {
    this.newPoll.options.splice(i, 1);
  }

  createPoll() {
    const id = Math.random().toString(36).substr(2, 8);
    const url = `https://yourapp.com/poll/${id}`;

    const createdPoll = {
      question: this.newPoll.question,
      options: this.newPoll.options.map(o => ({ text: o, voteCount: 0 })),
      url
    };

    this.polls.push(createdPoll);

    // Reset
    this.newPoll = { question: "", options: [""] };
    this.showForm = false;
  }

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    alert("URL copied!");
  }

}
