import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { FeaturesWidget } from '../../components/features/featureswidget';
import { HeroWidget } from '../../components/herowidget/herowidget';
import { HighlightsWidget } from '../../components/highlight/highlightswidget';

@Component({
    selector: 'app-main',
    imports: [RouterModule, FeaturesWidget, HeroWidget, HighlightsWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],

    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
    userService = inject(UserMainService);

    constructor() {}
    ngOnInit(): void {
        if (!this.userService.token() || !this.userService.userConnected().id) {
            this.userService.refreshToken().subscribe();
        }
    }
}
