import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {


  private authService = inject(AuthService);
  private toast = inject(ToastrService);

  email: string = '';
  password: string = '';


  onSubmit() {

    if (!this.email || !this.password) {
      this.toast.error('Provide email and password');
      return;
    }

    this.authService.signUp(this.email, this.password).subscribe({
      next: (res) => {
        if (res.status) {
          console.log(res)
        }
      }
    });

  }


}
