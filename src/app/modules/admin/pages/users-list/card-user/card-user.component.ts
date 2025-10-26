import { CommonModule } from '@angular/common';
import { Component, inject, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Image } from 'primeng/image';
import { UserResponseDTO } from '../../../../../../api/models';
import { ICellRendererAngularComp } from '../../../../../generic-components/smart-grid';
import { Router } from '@angular/router';

@Component({
    selector: 'app-card-user',
    imports: [ButtonModule, Image, CommonModule],
    templateUrl: './card-user.component.html',
    styleUrl: './card-user.component.scss'
})
export class CardUserComponent implements ICellRendererAngularComp {
    router = inject(Router);
    data = model.required<UserResponseDTO>();
    onShowMore = output<UserResponseDTO>();
    onViewClick($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.onShowMore.emit(this.data());
        this.router.navigate(['/teacher/profile/', this.data().id]);
    }
}
