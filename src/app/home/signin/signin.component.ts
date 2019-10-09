import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/auth/auth.service';
import { PlatformDetectorService } from 'src/app/core/platform-detector/platform-detector.service';

@Component({
    templateUrl: './signin.component.html'
})

export class SignInComponent implements OnInit {

    loginForm: FormGroup;
    fromUrl: string;
    @ViewChild('userNameInput') userNameInput: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        
        this.activatedRoute.queryParams.subscribe(params => {
            this.fromUrl = params.fromUrl;
        })

        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.platformDetectorService.isPlatformBrowser() && this.userNameInput.nativeElement.focus();
    }

    login() {
        const userName = this.loginForm.get('userName').value;
        const password = this.loginForm.get('password').value;

        this.authService.authenticate(userName, password).subscribe(() => {
            this.fromUrl
                ? this.router.navigateByUrl(this.fromUrl)
                : this.router.navigate(['user', userName]);
            
        }, err => {
            alert('Invalid username or password');
            this.loginForm.reset();
            this.platformDetectorService.isPlatformBrowser() && this.userNameInput.nativeElement.focus();
            
            
        });
    }
}