import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-account-confirmation',
    imports: [FluidModule, ButtonModule, RouterModule],
    templateUrl: './account-confirmation.component.html',
    styleUrl: './account-confirmation.component.scss'
})
export class AccountConfirmationComponent {}
