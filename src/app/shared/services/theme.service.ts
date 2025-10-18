import { Injectable } from '@angular/core';

export type Theme = {
    id: number;
    name: string;
    value: string;
};
/**
 * @obsolete 
 * Service pour gérer les thèmes de l'application.
 * Fournit des méthodes pour changer et obtenir le thème actif.
 * Gère une liste de thèmes disponibles.
 */
@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    activeTheme: Theme = {
        id: 1,
        value: 'lara-light-blue',
        name: 'Light blue'
    };

    allThemes: Theme[] = [
        {
            id: 1,
            value: 'lara-light-blue',
            name: 'Light blue'
        },
        {
            id: 2,
            value: 'aura-light-teal',
            name: 'Light teal'
        },
        {
            id: 3,
            value: 'aura-light-amber',
            name: 'Light amber'
        },
        {
            id: 4,
            value: 'lara-dark-blue',
            name: 'Dark blue'
        },
        {
            id: 5,
            value: 'aura-dark-amber',
            name: 'Dark amber'
        },

        {
            id: 6,
            value: 'aura-dark-noir',
            name: 'Dark noir'
        }
    ];

    constructor() {}

    changeTheme(activeTheme: Theme): void {
        const htmlLink = document.getElementById('app-theme') as HTMLLinkElement;
        htmlLink.href = activeTheme.value + '.css';
        this.activeTheme = activeTheme;
    }

    getActiveTheme() {}
}
