import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout/layout.service';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  imports: [CommonModule, HeaderComponent, RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  layoutSer = inject(LayoutService);
  activePage: 'chat' | 'poll' = 'poll';
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize')
  onResize() {
    this.layoutSer.onResize(window.innerWidth);
  }

  constructor() {
    effect(() => {
      this.isMobile = this.layoutSer.isMobileView();
    })
  }

  get isSidebarCollapsed() {
    return this.layoutSer.isCollapsed;
  }

}
