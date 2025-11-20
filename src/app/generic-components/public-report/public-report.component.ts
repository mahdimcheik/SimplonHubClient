import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { SmartSectionComponent } from '../smart-section/smart-section.component';
import { SmartKpiComponent } from '../smart-kpi/smart-kpi.component';
import { UserPublicReport } from '../../../api';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-public-report',
    imports: [SmartSectionComponent, SmartKpiComponent],
    templateUrl: './public-report.component.html',
    styleUrl: './public-report.component.scss'
})
export class PublicReportComponent {
    userservice = inject(UserMainService);
    messageService = inject(MessageService);
    destroyRef = inject(DestroyRef);
    activatedRoute = inject(ActivatedRoute);

    title = 'Données publiques';
    report = signal<UserPublicReport | null | undefined>(null);
    ngOnInit() {
        this.loadUserData();
    }

    private async loadUserData() {
        try {
            const userId = this.activatedRoute.snapshot.params['id'];
            const response = await this.userservice.GetPublicReport(userId);
            this.report.set(response.data);
        } catch {}
    }
}
