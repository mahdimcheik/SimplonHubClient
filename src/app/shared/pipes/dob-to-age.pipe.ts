import { Pipe, PipeTransform } from '@angular/core';
/**
 * Pipe qui convertit une date de naissance en âge.
 * Utilisation : {{ dateOfBirth | dobToAge }}
 */
@Pipe({
    name: 'dobToAge'
})
export class DobToAgePipe implements PipeTransform {
    transform(dob: Date | string | undefined | null): number {
        if (!dob) return 0;

        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Check if birthday has occurred this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
@Pipe({ name: 'dateIndicator' })
export class DateIndicatorPipe implements PipeTransform {
    transform(value: string | undefined): string {
        if (!value) return '';
        const date = new Date(value);
        const now = new Date();

        // Convertir en timestamp et calculer la différence en jours
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "aujourd'hui";
        if (diffDays === 1) return 'hier';
        if (diffDays > 1 && diffDays <= 7) return 'la semaine dernière';
        if (diffDays > 7 && diffDays <= 30) return 'le mois dernier';
        return 'Date antérieure à 30 jours';
    }
}
