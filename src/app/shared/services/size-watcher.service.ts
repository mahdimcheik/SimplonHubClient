import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime, BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map, switchMap, tap } from 'rxjs';
/**
 * @obsolete Utiliser BreakpointObserver de Angular CDK à la place
 * Service pour surveiller la taille de la fenêtre.
 * Fournit un signal réactif indiquant la taille actuelle de la fenêtre (small, medium, large, xlarge).
 * Utilise RxJS pour écouter les événements de redimensionnement de la fenêtre et mettre à jour le signal en conséquence.
 */
@Injectable({
    providedIn: 'root'
})
export class SizeWatcherService {
    private destroyRef = inject(DestroyRef);
    // size = signal<'small' | 'medium' | 'large' | 'xlarge'>('small');

    size$ = new BehaviorSubject<'small' | 'medium' | 'large' | 'xlarge'>('small');
    windowSizeWatcher$ = fromEvent(window, 'resize').pipe(
        auditTime(200),
        distinctUntilChanged(),
        tap(() => {
            // this.windowWidth$.next(window.innerWidth);
            this.getSize();
        })
    );
    constructor() {
        this.getSize();
        this.windowSizeWatcher$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
    /**
     * Détermine la taille actuelle de la fenêtre et met à jour le signal size$ en conséquence.
     * Les tailles sont définies comme suit :
     * - small : largeur < 640px
     */
    getSize() {
        if (window.innerWidth < 640) {
            this.size$.next('small');
        } else if (window.innerWidth < 768) {
            this.size$.next('medium');
        } else if (window.innerWidth < 1024) {
            this.size$.next('large');
        } else {
            this.size$.next('xlarge');
        }
    }
}
