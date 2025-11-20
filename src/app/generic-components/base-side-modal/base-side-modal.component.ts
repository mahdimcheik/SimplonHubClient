import { Component, DestroyRef, ElementRef, inject, input, model, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
    selector: 'app-base-side-modal',
    imports: [DrawerModule, ButtonModule, DividerModule],
    templateUrl: './base-side-modal.component.html',
    styleUrl: './base-side-modal.component.scss'
})
export class BaseSideModalComponent {
    breakPointservice = inject(BreakpointObserver);
    destroyRef = inject(DestroyRef);
    layoutService = inject(LayoutService);

    visible = model(false);
    title = input<string>('Titre');
    iconClass = input<string>('pi pi-info-circle');
    position = input<'left' | 'right' | 'top' | 'bottom'>('right');
    // width = signal<string>(window.innerWidth < 768 ? '100vw' : '50vw');
    widthClass = signal<string>(window.innerWidth < 768 ? '!w-[100vw]' : '!w-[50vw]');

    constructor() {
        this.breakPointservice
            .observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result.breakpoints[Breakpoints.Small]) {
                    this.widthClass.set('!w-[100vw]');
                } else {
                    this.widthClass.set('!w-[50vw]');
                }
                // this.width.set(result.breakpoints[Breakpoints.Medium] ? '100vw' : '50vw');
            });
    }

    onHide = () => {
        this.visible.set(false);
    };
}
