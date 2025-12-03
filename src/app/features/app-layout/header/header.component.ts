import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout/layout.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() isMobile!: boolean;

  layoutSer = inject(LayoutService);
  

  toggleChat(view: 'chat' | 'poll') {
    this.layoutSer.toggleChat(view);
  }

}
