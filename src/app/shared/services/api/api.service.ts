import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ListPoll, Poll } from '../../../core/types/poll.model';
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
  pollId: string | null = null;
  setPollId(id: string) {
    this.pollId = id;
    this.pollIdSubject.next(id);
  }

  private selectePollSubject = new BehaviorSubject<Poll | null>(null);
  $pollObserver = this.selectePollSubject.asObservable();
  selectPoll(poll: Poll) {
    this.selectePollSubject.next(poll);
  }

  poll$ = combineLatest([
    this.$pollIdObserver,
    this.$pollObserver
  ]).pipe(
    map(([pollId, poll]) => poll || { id: pollId }),
    filter(p => !!p.id)
  );

  getUserPolls(): Observable<AuthResponse<ListPoll[]>> {
    return this.http.get<AuthResponse<ListPoll[]>>(`${environment.apiURL}poll-list`);
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

  sendMessage(pollId: string, message: string): Observable<AuthResponse<ChatMessage>> {
    return this.http.post<AuthResponse<ChatMessage>>(`${environment.apiURL}message`, { pollId, message });
  }

  getMessages(page: number, pollId: string): Observable<AuthResponse<ChatMessage[]>> {
    return this.http.get<AuthResponse<ChatMessage[]>>(`${environment.apiURL}message?page=${page}&pollId=${pollId}`);
  }

}
