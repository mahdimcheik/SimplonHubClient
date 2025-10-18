import { Component, model } from '@angular/core';
import { Chip } from 'primeng/chip';
import { LanguageResponseDTO, ProgrammingLanguage } from '../../../api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-chips-list',
    imports: [Chip, TooltipModule],
    templateUrl: './chips-list.component.html',
    styleUrl: './chips-list.component.scss'
})
export class ChipsListComponent {
    chips = model<(LanguageResponseDTO & { description: string })[] | ProgrammingLanguage[]>([]);
    noContent = model<string | null>(null);
}
