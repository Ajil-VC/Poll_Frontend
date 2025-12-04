import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Poll } from '../../../core/types/poll.model';
import { AuthResponse } from '../../../core/types/core.type';
import { ChatMessage } from '../../../core/types/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  http = inject(HttpClient);

  private pollIdSubject = new BehaviorSubject<string | null>(null);
  $pollIdObserver = this.pollIdSubject.asObservable();
  setPollId(id: string) {
    this.pollIdSubject.next(id);
  }

  createPoll(question: string, options: Array<string>): Observable<AuthResponse<Poll>> {
    return this.http.post<AuthResponse<Poll>>(`${environment.apiURL}poll`, { question, options });
  }

  getAllPolls(): Observable<AuthResponse<Poll[]>> {
    return this.http.get<AuthResponse<Poll[]>>(`${environment.apiURL}poll`);
  }

  fetchPoll(id: string): Observable<AuthResponse<Poll>> {
    return this.http.get<AuthResponse<Poll>>(`${environment.apiURL}poll/${id}`);
  }

  giveVote(pollId: string, optionId: string): Observable<AuthResponse<Poll>> {
    return this.http.put<AuthResponse<Poll>>(`${environment.apiURL}poll`, { pollId, optionId });
  }

  sendMessage(pollId: string, message: string): Observable<AuthResponse<ChatMessage>> {
    return this.http.post<AuthResponse<ChatMessage>>(`${environment.apiURL}message`, { pollId, message });
  }

  getMessages(page: number, pollId: string): Observable<AuthResponse<ChatMessage[]>> {
    return this.http.get<AuthResponse<ChatMessage[]>>(`${environment.apiURL}message?page=${page}&pollId=${pollId}`);
  }

}
