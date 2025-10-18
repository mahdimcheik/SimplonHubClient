import { Component, inject } from '@angular/core';

import { LayoutService } from '../../../../layout/service/layout.service';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [],
    templateUrl: './app.featureswidget.html'
})
export class FeaturesWidget {
    layoutService = inject(LayoutService);
}
