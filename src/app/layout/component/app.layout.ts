import { Component, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './topbar/app.topbar';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '../service/layout.service';
import { AppFooter } from './footer/app.footer';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, ToastModule], //AppFooter,
    template: `<div class="layout-wrapper" [ngClass]="containerClass" (click)="isOutsideClicked($event)">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container ">
            <div class="layout-main pt-8">
                <router-outlet></router-outlet>
            </div>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class AppLayout {
    menuOutsideClickListener: any;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        if (!(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget))) {
            this.hideMenu();
        }
    }

    hideMenu() {
        this.layoutService.closeSidebar();
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.isMenuDesktopInactive() && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.isSidebarActive(),
            'layout-mobile-active': this.layoutService.isMenuMobileActive()
        };
    }

    ngOnDestroy() {
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
