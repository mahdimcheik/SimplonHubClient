import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { RequiredAsteriskDirective } from '../../../../shared/directives/required-asterisk.directive';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-account-created-successfully',
    imports: [FluidModule, ButtonModule, RequiredAsteriskDirective, RouterModule],
    templateUrl: './account-created-successfully.component.html',
    styleUrl: './account-created-successfully.component.scss'
})
export class AccountCreatedSuccessfullyComponent {}
