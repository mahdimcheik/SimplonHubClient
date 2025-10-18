import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    templateUrl: './app.notfound.html'
})
export class Notfound {
    layoutService = inject(LayoutService);
}
