import { Component, inject } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mentions-legales',
    imports: [RouterLink],
    templateUrl: './mentions-legales.component.html',
    styleUrl: './mentions-legales.component.scss'
})
export class MentionsLegalesComponent {
    owner = inject(UserMainService).teacherDetails;

    getCurrentDate(): string {
        return new Date().toLocaleDateString('fr-FR');
    }
}
