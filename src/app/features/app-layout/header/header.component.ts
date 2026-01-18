import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout/layout.service';
import { SideMenu } from '../../../core/types/activepage';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() isMobile!: boolean;

  layoutSer = inject(LayoutService);


  toggleChat(view: SideMenu) {

    this.layoutSer.toggleChat(view);
    if (this.layoutSer.isCollapsed) {

      this.layoutSer.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.layoutSer.toggleSidebar();

  }

}
