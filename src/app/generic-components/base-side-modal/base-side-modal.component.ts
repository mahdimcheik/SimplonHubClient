import { Component, DestroyRef, ElementRef, inject, input, model, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-base-side-modal',
    imports: [DrawerModule, ButtonModule, DividerModule],
    templateUrl: './base-side-modal.component.html',
    styleUrl: './base-side-modal.component.scss'
})
export class BaseSideModalComponent {
    breakPointservice = inject(BreakpointObserver);
    destroyRef = inject(DestroyRef);

    visible = model(false);
    title = input<string>('Titre');
    iconClass = input<string>('pi pi-info-circle');
    position = input<'left' | 'right' | 'top' | 'bottom'>('right');
    width = signal<string>(window.innerWidth < 768 ? '100vw' : '50vw');

    constructor() {
        this.breakPointservice
            .observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.width.set(result.breakpoints[Breakpoints.Medium] ? '100vw' : '50vw');
            });
    }

    onHide = () => {
        this.visible.set(false);
    };
}
