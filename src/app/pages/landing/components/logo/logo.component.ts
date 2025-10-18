import { Component, inject, input } from '@angular/core';
import { LayoutService } from '../../../../layout/service/layout.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logo',
    imports: [],
    template: ` <a class="flex items-center mr-4 cursor-pointer" (click)="goToHome()">
        @if (!invert()) {
            <img [src]="layoutService.layoutConfig().darkTheme ? 'assets/latestWhite.svg' : 'assets/latestBlack.svg'" alt="logo" width="100" />
        } @else {
            <img [src]="layoutService.layoutConfig().darkTheme ? 'assets/latestBlack.svg' : 'assets/latestWhite.svg'" alt="logo" width="100" />
        }
    </a>`,
    styleUrl: './logo.component.scss'
})
export class LogoComponent {
    layoutService = inject(LayoutService);
    router = inject(Router);
    invert = input<boolean>(false);
    goToHome() {
        this.router.navigate(['/']);
    }
}
