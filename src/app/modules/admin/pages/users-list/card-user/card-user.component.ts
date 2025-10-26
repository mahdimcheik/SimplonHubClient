import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Image } from 'primeng/image';
import { UserResponseDTO } from '../../../../../../api/models';
import { ICellRendererAngularComp } from '../../../../../generic-components/smart-grid';

@Component({
    selector: 'app-card-user',
    imports: [ButtonModule, Image, CommonModule],
    templateUrl: './card-user.component.html',
    styleUrl: './card-user.component.scss'
})
export class CardUserComponent implements ICellRendererAngularComp {
    data = model.required<UserResponseDTO>();
}
