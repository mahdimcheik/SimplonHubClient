import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-base-card',
    standalone: true,
    imports: [CardModule, CommonModule],
    templateUrl: './base-card.component.html',
    styleUrl: './base-card.component.scss'
})
export class BaseCardComponent {
    // Optional inputs for customization
    readonly headerClass = input<string>('');
    readonly bodyClass = input<string>('');
    readonly footerClass = input<string>('');
    readonly cardClass = input<string>('');
}
