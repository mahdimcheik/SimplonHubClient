
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../../../../layout/service/layout.service';

@Component({
    selector: 'app-auth-layout',
    imports: [RouterModule],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
    layoutService = inject(LayoutService);
}
