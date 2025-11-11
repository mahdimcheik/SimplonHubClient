import { Component, computed, inject, model, OnInit } from '@angular/core';
import { BaseCardComponent } from '../../../../../generic-components/base-card/base-card.component';
import { LanguageResponseDTO, ProgrammingLanguage, UserResponseDTO } from '../../../../../../api';
import { ImageModule } from 'primeng/image';
import { ICellRendererAngularComp } from '../../../../../generic-components/smart-grid';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-teacher-card',
    imports: [BaseCardComponent, ImageModule, ChipModule, ButtonModule],
    templateUrl: './teacher-card.component.html',
    styleUrl: './teacher-card.component.scss'
})
export class TeacherCardComponent implements ICellRendererAngularComp, OnInit {
    router = inject(Router);

    data = model<UserResponseDTO>();
    params = model<any>();
    teacher = computed<UserResponseDTO | undefined>(() => this.data() as UserResponseDTO | undefined);
    programmingLanguages = computed<ProgrammingLanguage[]>(() => this.teacher()?.programmingLanguages?.slice(0, 3) ?? []);
    languages = computed<LanguageResponseDTO[]>(() => this.teacher()?.languages?.slice(0, 3) ?? []);

    ngOnInit(): void {
        console.log('teacher', this.teacher());
    }

    seeProfile() {
        this.router.navigate(['/teacher/profile/', this.teacher()?.id]);
    }
    goBookPage($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.router.navigate(['/student/calendar-student'], { queryParams: { teacherId: this.teacher()?.id } });
    }
}
