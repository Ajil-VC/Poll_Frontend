import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../../core/types/user.model';
import { ChatMessage } from '../../../core/types/chat.model';
import { Poll } from '../../../core/types/poll.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private url = environment.baseUrl;



  constructor() {

    this.socket = io(this.url, {
      transports: ['websocket'],
      autoConnect: false,
    });

    // Setup connection event listeners
    this.setupConnectionListeners();
  }


  private setupConnectionListeners(): void {
    this.socket.on('connection', () => {
      console.log('Connected to server with ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
    });
  }

  // Connect to the server
  connect(token: string): void {
    if (!this.socket.connected) {
      this.socket.auth = { token };
      this.socket.connect();
    }
  }

  // Disconnect from the server
  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket.connected;
  }

  // Get socket ID
  getSocketId(): string | undefined {
    return this.socket.id;
  }

  // Join with pollId
  join(pollId: string): void {
    this.socket.emit('join-poll', pollId);
  }

  // Send a message
  sendMessage(text: string, pollId: string): void {
    this.socket.emit('send-message', { text, pollId });
  }

  // Send typing indicator
  sendTyping(isTyping: boolean): void {
    this.socket.emit('typing', isTyping);
  }

  // Listen for new messages
  onNewMessage(): Observable<ChatMessage> {
    return new Observable(observer => {
      this.socket.on('new-message', (message: any) => {
        observer.next(message);
      });

      return () => {
        this.socket.off('new-message');
      };
    });
  }



  // Listen for users list
  onUsersList(): Observable<User[]> {
    return new Observable(observer => {
      this.socket.on('users-list', (users: User[]) => {
        observer.next(users);
      });

      return () => {
        this.socket.off('users-list');
      };
    });
  }

  // Listen for typing indicator
  onUserTyping(): Observable<{ email: string, isTyping: boolean }> {
    return new Observable(observer => {
      this.socket.on('user-typing', (data: { email: string, isTyping: boolean }) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('user-typing');
      };
    });
  }


  // Caste Vote
  casteVote(pollId: string, optionId: string): void {
    this.socket.emit('poll', { pollId, optionId });
  }

  // Listen for new polls
  onNewPolls(): Observable<Poll> {
    return new Observable(observer => {
      this.socket.on('new-poll', (poll: Poll) => {
        observer.next(poll);
      });

      return () => {
        this.socket.off('new-message');
      };
    });
  }

  // Remove specific listener
  off(eventName: string): void {
    this.socket.off(eventName);
  }

}