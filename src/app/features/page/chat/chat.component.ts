import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { ChatMessage } from '../../../core/types/chat.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from '../../../core/types/user.model';
import { SocketService } from '../../../shared/services/socket/socket.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  currentUser!: User | null;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  @ViewChild('messagesContainer') chatWindow!: ElementRef;

  api = inject(ApiService);
  socket = inject(SocketService);
  toast = inject(ToastrService);
  auth = inject(AuthService);

  isMobile = window.innerWidth < 768;
  usersOpen = false;

  typingTimeout: any = null;
  isTypingSent = false;

  typingUsers: string[] = [];
  newMessage = '';
  currentPage: number = 1;
  pollId: string | null = null;
  pollId$ = this.api.poll$;


  users: User[] = [];

  messages: ChatMessage[] = [];

  ngOnInit() {
    this.api.poll$
      .pipe(takeUntil(this.destroy$))
      .subscribe(poll => {

        if (poll.id) {
          this.pollId = poll.id;
          this.getMessages(1, poll.id);
          this.scrollToBottom();
        }
      });


    this.auth.$currUser
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.currentUser = res;
        }
      })

    this.setupSocketListeners();

    // initial scroll`
    setTimeout(() => this.scrollToBottom(), 0);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }



  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) this.usersOpen = false;
  }



  private setupSocketListeners(): void {
    // Listen for new messages
    const messageSub = this.socket.onNewMessage().subscribe(
      (message) => {

        this.messages.push(message);
        this.scrollToBottom();
      }
    );
    this.subscriptions.push(messageSub);

    // Listen for users list
    const usersSub = this.socket.onUsersList().subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );
    this.subscriptions.push(usersSub);

    // Listen for typing indicator
    const typingSub = this.socket.onUserTyping().subscribe(
      (data) => {

        if (data.isTyping) {
          if (!this.typingUsers.includes(data.email)) {
            this.typingUsers.push(data.email);
          }
        } else {
          this.typingUsers = this.typingUsers.filter(u => u !== data.email);
        }
      }
    );
    this.subscriptions.push(typingSub);

  }

  getMessages(page: number = 1, pollId: string) {
    this.api.getMessages(page, pollId).subscribe({
      next: (res) => {

        if (res.status) {
          this.messages.unshift(...res.data);
        }
      }
    });
  }

  sendMessage() {

    if (!this.socket.isConnected()) {
      this.socket.connect();
      return;
    }

    const text = this.newMessage.trim();
    if (!this.pollId) {
      this.toast.error('Please wait a moment to establish the connection');
      return;
    }
    if (!text) return;
    this.socket.sendMessage(text, this.pollId);

    this.newMessage = '';
    this.scrollToBottom();

  }

  onTyping() {
    if (!this.isTypingSent) {
      this.socket.sendTyping(true);
      this.isTypingSent = true;
    }

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      this.socket.sendTyping(false);
      this.isTypingSent = false;
    }, 1000);

  }

  toggleUsers() {
    this.usersOpen = !this.usersOpen;
  }

  selectUser(userId: string) {
    // could open user profile or start DM; placeholder
    console.log('selected user', userId);
  }

  getUserName(userId: string) {
    return this.users.find(u => u.id === userId)?.email ?? 'Unknown';
  }

  scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        // small timeout to allow DOM update
        setTimeout(() => {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }, 50);
      }
    } catch (e) { /* ignore */ }
  }

  onScroll() {
    const el = this.messagesContainer.nativeElement;
    if (el.scrollTop === 0) {
      if (!this.pollId) return;
      this.getMessages(++this.currentPage, this.pollId);
    }

  }

  formatTime(iso: string | undefined) {
    if (!iso) return;
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }


}
