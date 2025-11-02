import { Component, computed, model, OnInit } from '@angular/core';
import { BaseCardComponent } from '../../../../../generic-components/base-card/base-card.component';
import { UserResponseDTO } from '../../../../../../api';
import { ImageModule } from 'primeng/image';
import { ICellRendererAngularComp } from '../../../../../generic-components/smart-grid';

@Component({
    selector: 'app-teacher-card',
    imports: [BaseCardComponent, ImageModule],
    templateUrl: './teacher-card.component.html',
    styleUrl: './teacher-card.component.scss'
})
export class TeacherCardComponent implements ICellRendererAngularComp, OnInit {
    data = model<UserResponseDTO>();
    params = model<any>();
    teacher = computed<UserResponseDTO | undefined>(() => this.data() as UserResponseDTO | undefined);
    ngOnInit(): void {
        console.log('teacher', this.teacher());
    }
}
