import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Image } from 'primeng/image';
import { UserResponseDTO } from '../../../../../../api/models';

@Component({
    selector: 'app-card-user',
    imports: [ButtonModule, Image, CommonModule],
    templateUrl: './card-user.component.html',
    styleUrl: './card-user.component.scss'
})
export class CardUserComponent {
    user = model.required<UserResponseDTO>();
}
