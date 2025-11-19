import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroWidget } from '../../components/herowidget/herowidget';
import { FeaturesWidget } from '../../components/features/featureswidget';
import { HighlightsWidget } from '../../components/highlight/highlightswidget';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { UserMainService } from '../../../../shared/services/userMain.service';

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
        this.userService.getprofile().subscribe();
    }
}
