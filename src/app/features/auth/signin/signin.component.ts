import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {


  email: string = '';
  password: string = '';
  authService = inject(AuthService);
  toast = inject(ToastrService);

  signIn() {

    if (!this.email || !this.password) {
      this.toast.error('Provide email and password');
      return;
    }

    this.authService.signIn(this.email, this.password).subscribe({
      next: (res) => {
        if (res.status) {
          console.log(res)
        }
      }
    })
  }

}
