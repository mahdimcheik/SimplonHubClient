/**
 * Enumération représentant les genres possibles pour un utilisateur.
 */
export enum EnumGender {
    Homme = 0,
    Femme = 1,
    NonBinaire = 2,
    Autre = 3
}

export type GenderDropDown = {
    id: string;
    name: string;
    value: number;
};
