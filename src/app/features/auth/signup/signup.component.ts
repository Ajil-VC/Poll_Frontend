import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  private router = inject(Router);

  email: string = '';
  password: string = '';


  onSubmit() {

    if (!this.email || !this.password) {
      this.toast.error('Provide email and password');
      return;
    }

    this.authService.signUp(this.email, this.password).subscribe({
      next: (res) => {
        console.log(res)
        if (res.status) {
          this.router.navigate(['app/home']);
        }
      }
    });

  }


}
