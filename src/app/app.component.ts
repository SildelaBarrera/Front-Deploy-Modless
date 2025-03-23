import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Modless-Front';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.resetInactivityTimer();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  onUserActivity(): void {
    this.authService.resetInactivityTimer();
  }
}
