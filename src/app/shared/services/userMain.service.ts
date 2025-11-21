import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { catchError, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalstorageService } from './localstorage.service';
// import { SSEMainService } from './sseMain.service';

// Generated services and models
import {
    AuthService,
    ForgotPasswordInput,
    LanguageResponseDTO,
    LanguageResponseDTOListResponseDTO,
    LanguagesService,
    LoginOutputDTO,
    LoginOutputDTOResponseDTO,
    PasswordRecoveryInput,
    PasswordResetResponseDTO,
    PasswordResetResponseDTOResponseDTO,
    RoleAppResponseDTO,
    RoleAppResponseDTOListResponseDTO,
    RoleAppResponseDTOResponseDTO,
    RoleAppService,
    RoleAppUpdateDTO,
    StatusAccountCreateDTO,
    StatusAccountDTO,
    StatusAccountResponseDTO,
    StatusAccountResponseDTOListResponseDTO,
    StatusAccountResponseDTOResponseDTO,
    StatusAccountService,
    StatusAccountUpdateDTO,
    StringResponseDTO,
    UserCreateDTO,
    UserInfosWithtoken,
    UserInfosWithtokenResponseDTO,
    UserLoginDTO,
    UserPublicReport,
    UserPublicReportResponseDTO,
    UserResponseDTO,
    UserResponseDTOResponseDTO,
    UserUpdateDTO
} from '../../../api';
import { ResponseDTO } from '../models/response-dto';
import { CustomTableState } from '../models/TableColumn ';
import { CookieConsentService } from './cookie-consent.service';

/**
 * service pour gérer les utilisateurs.
 * en fonction de leurs roles, les liens de la sidebar changent.
 * Fournit des méthodes pour l'authentification, l'inscription, la gestion des profils, etc. via l'API.
 * Utilise UsersService généré par OpenAPI pour les appels API.
 */
@Injectable({
    providedIn: 'root'
})
export class UserMainService {
    baseUrl = environment.API_URL;
    private authService = inject(AuthService);
    private localStorageService = inject(LocalstorageService);

    router = inject(Router);
    messageService = inject(MessageService);
    cookieConsentService = inject(CookieConsentService);
    statusAccountService = inject(StatusAccountService);
    roleAppService = inject(RoleAppService);
    languageService = inject(LanguagesService);
    // pour la page profile
    userConnected = signal({} as UserResponseDTO);

    isAdmin = computed(() => this.userConnected()?.roles?.some((role) => role.name === 'Admin'));
    isSuperAdmin = computed(() => this.userConnected()?.roles?.some((role) => role.name === 'SuperAdmin'));
    isTeacher = computed(() => this.userConnected()?.roles?.some((role) => role.name === 'Teacher'));
    isStudent = computed(() => this.userConnected()?.roles?.some((role) => role.name === 'Student'));

    // lien de side navbar
    sideNavItems = signal<MenuItem[]>([]);
    landingNavItems = signal<MenuItem[]>([]);
    authNavItems = signal<MenuItem[]>([]);

    // pour la page qui je suis ?
    teacherDetails = signal({} as UserResponseDTO);

    refreshAccessToken = signal<string | null>(null);
    token = signal<string>('');
    allLanguages = signal<LanguageResponseDTO[]>([]);
    allAccountStatuses = signal<StatusAccountDTO[]>([]);

    constructor() {
        effect(() => {
            const user = this.userConnected();
            if (this.isAdmin()) {
                this.sideNavItems.set([
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/admin/users-list'] },
                    { label: 'Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/reservation/list'] },
                    { label: 'Calendrier', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/reservation/calendar-for-teacher'] },
                    { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/dashboard/students-list'] },
                    { label: 'Profil', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/profile/me'] }
                ]);
                this.landingNavItems.set([
                    { label: 'Accueil', icon: 'pi pi-home', routerLink: ['/'] },
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Qui sommes nous', icon: 'pi pi-users', routerLink: ['/landing/about-us'] }
                ]);
            } else if (this.isSuperAdmin()) {
                this.sideNavItems.set([
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Utilisateurs', icon: 'pi pi-users', routerLink: ['/admin/users-list'] },
                    { label: 'Paramètres', icon: 'pi pi-cog', routerLink: ['/admin/adminitration'] }
                ]);
                this.landingNavItems.set([
                    { label: 'Accueil', icon: 'pi pi-home', routerLink: ['/'] },
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Qui sommes nous', icon: 'pi pi-users', routerLink: ['/landing/about-us'] }
                ]);
            } else if (this.isTeacher()) {
                this.sideNavItems.set([
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/teacher/calendar-teacher'] },
                    { label: 'Calendrier', icon: 'pi pi-fw pi-home', routerLink: ['/teacher/calendar-teacher'] },
                    { label: 'Mes Réservations', icon: 'pi pi-fw pi-list', routerLink: ['/teacher/reservation-list'] },
                    { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/teacher/profile/me'] }
                ]);
                this.landingNavItems.set([
                    { label: 'Accueil', icon: 'pi pi-home', routerLink: ['/'] },
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Qui sommes nous', icon: 'pi pi-users', routerLink: ['/landing/about-us'] }
                ]);
            } else if (this.isStudent()) {
                this.sideNavItems.set([
                    { label: 'Calendrier', icon: 'pi pi-fw pi-home', routerLink: ['/student/calendar-student'] },
                    { label: 'Favoris', icon: 'pi pi-fw pi-heart', routerLink: ['/student/favorites'] },
                    { label: 'Liste Professeurs', icon: 'pi pi-fw pi-list', routerLink: ['/student/list-teachers'] },
                    {
                        label: 'Mes Réservations',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/student/reservation-list']
                    }
                ]);
                this.landingNavItems.set([
                    { label: 'Accueil', icon: 'pi pi-home', routerLink: ['/'] },
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Qui sommes nous', icon: 'pi pi-users', routerLink: ['/landing/about-us'] }
                ]);
            } else {
                this.sideNavItems.set([]);
                this.landingNavItems.set([
                    { label: 'Accueil', icon: 'pi pi-home', routerLink: ['/'] },
                    { label: 'Qui sommes nous', icon: 'pi pi-users', routerLink: ['/landing/about-us'] }
                ]);
            }

            const untrackedUser = untracked(this.userConnected);
            console.log(untrackedUser.roles);

            if (untrackedUser.email) {
                this.authNavItems.set([
                    {
                        label: 'Profil',
                        icon: 'pi pi-user',
                        routerLink: untrackedUser.roles.find((role) => role.name.toLowerCase() === 'teacher'.toLowerCase()) ? ['/teacher/profile/me'] : ['/student/profile/me']
                    },
                    {
                        label: 'Déconnexion',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.logout();
                        }
                    }
                ]);
            } else {
                this.authNavItems.set([
                    {
                        label: 'Se connecter',
                        icon: 'pi pi-sign-in',
                        routerLink: ['/auth/login']
                    },
                    {
                        label: "S'inscrire",
                        icon: 'pi pi-user-plus',
                        routerLink: ['/auth/register']
                    }
                ]);
            }
        });
    }
    /**
     * Enregistre un nouvel utilisateur.
     * @param userDTO les données de l'utilisateur à enregistrer
     * @returns Un observable contenant la réponse de l'API
     */
    register(userDTO: UserCreateDTO): Observable<ResponseDTO<UserResponseDTO>> {
        return this.authService.authRegisterPost(userDTO).pipe(
            map((response) => {
                return {
                    message: response.message ?? '',
                    status: response.status!,
                    data: response.data as UserResponseDTO
                };
            }),
            catchError((error) => {
                console.error("Erreur lors de l'inscription :", error);
                return of({
                    message: error.message ?? 'Erreur inconnue',
                    status: error.status ?? 500,
                    data: {} as UserResponseDTO
                } as ResponseDTO<UserResponseDTO>);
            })
        );
    }

    /**
     * Authentifie un utilisateur.
     * @param userLoginDTO les données de connexion de l'utilisateur
     * @returns Un observable contenant la réponse de l'API
     */
    login(userLoginDTO: UserLoginDTO): Observable<ResponseDTO<LoginOutputDTO>> {
        return this.authService.authLoginPost(userLoginDTO).pipe(
            map((response) => {
                return {
                    message: response.message ?? '',
                    status: response.status!,
                    data: response.data as LoginOutputDTO
                };
            }),
            tap((res) => {
                if (res.data) {
                    this.cookieConsentService.acceptAll();
                    this.userConnected.set(res.data.user as UserResponseDTO);
                    this.token.set(res.data.token ?? '');
                }
            })
        );
    }
    /**
     * Rafraîchit le token d'authentification.
     * @returns Un observable contenant la réponse de l'API
     */
    refreshToken(): Observable<LoginOutputDTO> {
        return this.authService.authRefreshTokenGet().pipe(
            switchMap((response: LoginOutputDTOResponseDTO) => {
                const legacyResponse: LoginOutputDTO = {
                    refreshToken: response.data?.refreshToken ?? '',
                    user: response.data?.user as UserResponseDTO,
                    token: response.data?.token ?? ''
                };
                return of(legacyResponse);
            }),
            tap((res) => {
                this.token.set(res.token ?? '');
                this.userConnected.set(res.user as UserResponseDTO);
            })
        );
    }

    /**
     * Récupère les informations du profil de l'utilisateur. en utilisant le refresh-token
     * @returns Un observable contenant la réponse de l'API
     */
    getprofile(): Observable<ResponseDTO<UserInfosWithtoken>> {
        return this.authService.authMyInformationsGet().pipe(
            switchMap((response: UserInfosWithtokenResponseDTO) => {
                const legacyResponse: ResponseDTO<UserInfosWithtoken> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data
                };
                return of(legacyResponse);
            }),
            tap((res) => {
                if ((res.data as any).user) {
                    this.userConnected.set((res.data as any).user);
                    this.token.set((res.data as any).token);
                }
            }),
            catchError((error) => {
                this.userConnected.set({} as UserResponseDTO);
                return of({
                    message: error.message ?? 'Erreur inconnue',
                    status: error.status ?? 500,
                    data: {} as UserInfosWithtoken
                } as ResponseDTO<UserInfosWithtoken>);
            })
        );
    }

    async getPublicInformations(userId: string) {
        const response = await firstValueFrom(
            this.authService.authPublicInformationsGet(userId).pipe(
                switchMap((response: UserResponseDTOResponseDTO) => {
                    const legacyResponse: ResponseDTO<UserResponseDTO> = {
                        message: response.message || '',
                        status: response.status || 200,
                        data: response.data as UserResponseDTO
                    };
                    return of(legacyResponse);
                })
            )
        );
        return response;
    }

    async GetPublicReport(userId: string) {
        const response = await firstValueFrom(
            this.authService.authTeacherReportGet(userId).pipe(
                switchMap((response: UserPublicReportResponseDTO) => {
                    const legacyResponse: ResponseDTO<UserPublicReport> = {
                        message: response.message || '',
                        status: response.status || 200,
                        data: response.data as UserPublicReport
                    };
                    return of(legacyResponse);
                })
            )
        );
        return response;
    }

    /**
     * Récupère le profil public d'un utilisateur par son ID.
     * @param input les données pour réinitialiser le mot de passe (email)
     * @returns Un observable contenant la réponse de l'API
     */
    forgotPassword(input: { email: string }): Observable<ResponseDTO<PasswordResetResponseDTO>> {
        const forgotPasswordInput: ForgotPasswordInput = {
            email: input.email
        };
        return this.authService.authForgotPasswordPost(forgotPasswordInput).pipe(
            switchMap((response: PasswordResetResponseDTOResponseDTO) => {
                const legacyResponse: ResponseDTO<PasswordResetResponseDTO> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as PasswordResetResponseDTO
                };
                return of(legacyResponse);
            })
        );
    }

    /**
     * Récupère le profil public d'un utilisateur par son ID.
     * @param changePassword les données pour réinitialiser le mot de passe (token, newPassword)
     * @returns Un observable contenant la réponse de l'API
     */
    resetPassword(changePassword: PasswordRecoveryInput): Observable<ResponseDTO<string>> {
        return this.authService.authResetPasswordPost(changePassword).pipe(
            switchMap((response: StringResponseDTO) => {
                const legacyResponse: ResponseDTO<string> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as string
                };
                return of(legacyResponse);
            })
        );
    }

    /**
     * Réinitialise les données utilisateur stockées localement.
     * Utilisé lors de la déconnexion.
     * @returns void
     */
    reset(): void {
        this.localStorageService.reset();
        this.userConnected.set({} as UserResponseDTO);
        this.token.set('');
    }

    async logout(): Promise<void> {
        this.reset();
        await firstValueFrom(
            this.authService.authLogoutGet().pipe(
                tap(() => {
                    this.router.navigate(['/auth/login']);
                })
            )
        );
    }

    /**
     * Met à jour les informations personnelles de l'utilisateur.
     * @param userUpdated les données de l'utilisateur à mettre à jour
     * @returns Un observable contenant la réponse de l'API
     */
    updatePersonnalInfos(userUpdated: UserUpdateDTO): Observable<ResponseDTO<UserResponseDTO>> {
        return this.authService.authUpdatePatch(userUpdated).pipe(
            switchMap((response: any) => {
                const legacyResponse: ResponseDTO<UserResponseDTO> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as UserResponseDTO
                };
                return of(legacyResponse);
            }),
            tap((res) => {
                if (res.data) {
                    this.userConnected.set(res.data);
                    this.localStorageService.setUser(res.data);
                }
            })
        );
    }

    // status account
    getStatusAccount(CustomTableState: CustomTableState): Observable<ResponseDTO<StatusAccountDTO[]>> {
        if (this.allAccountStatuses().length > 0) {
            return of({
                message: 'Account statuses fetched from cache',
                status: 200,
                data: this.allAccountStatuses()
            });
        }
        return this.statusAccountService.statusaccountAllPost(CustomTableState).pipe(
            switchMap((response: StatusAccountResponseDTOListResponseDTO) => {
                const legacyResponse: ResponseDTO<StatusAccountDTO[]> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as StatusAccountDTO[]
                };
                this.allAccountStatuses.set(legacyResponse.data ?? []);
                return of(legacyResponse);
            })
        );
    }
    CreateStatus(status: StatusAccountCreateDTO): Observable<ResponseDTO<StatusAccountResponseDTO>> {
        return this.statusAccountService.statusaccountCreatePost(status).pipe(
            switchMap((response: StatusAccountResponseDTOResponseDTO) => {
                const legacyResponse: ResponseDTO<StatusAccountResponseDTO> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as StatusAccountResponseDTO
                };
                return of(legacyResponse);
            })
        );
    }
    UpdateStatus(statusId: string, status: StatusAccountUpdateDTO): Observable<ResponseDTO<StatusAccountResponseDTO>> {
        return this.statusAccountService.statusaccountUpdateIdPut(statusId, status).pipe(
            switchMap((response: StatusAccountResponseDTOResponseDTO) => {
                const legacyResponse: ResponseDTO<StatusAccountResponseDTO> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as StatusAccountResponseDTO
                };
                return of(legacyResponse);
            })
        );
    }

    // users roles
    getRoles(CustomTableState: CustomTableState): Observable<ResponseDTO<RoleAppResponseDTO[]>> {
        return this.roleAppService.roleappAllPost(CustomTableState).pipe(
            switchMap((response: RoleAppResponseDTOListResponseDTO) => {
                const legacyResponse: ResponseDTO<RoleAppResponseDTO[]> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data ?? []
                };
                return of(legacyResponse);
            })
        );
    }

    UpdateRole(roleId: string, role: RoleAppUpdateDTO): Observable<ResponseDTO<RoleAppResponseDTO>> {
        return this.roleAppService.roleappUpdateIdPut(roleId, role).pipe(
            switchMap((response: RoleAppResponseDTOResponseDTO) => {
                const legacyResponse: ResponseDTO<RoleAppResponseDTO> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as RoleAppResponseDTO
                };
                return of(legacyResponse);
            })
        );
    }
    // languages
    getLanguages(CustomTableState: CustomTableState): Observable<ResponseDTO<LanguageResponseDTO[]>> {
        if (this.allLanguages().length > 0) {
            return of({
                message: 'Languages fetched from cache',
                status: 200,
                data: this.allLanguages()
            });
        }
        return this.languageService.languagesAllPost(CustomTableState).pipe(
            switchMap((response: LanguageResponseDTOListResponseDTO) => {
                const legacyResponse: ResponseDTO<LanguageResponseDTO[]> = {
                    message: response.message || '',
                    status: response.status || 200,
                    data: response.data as LanguageResponseDTO[]
                };
                this.allLanguages.set(legacyResponse.data ?? []);
                return of(legacyResponse);
            })
        );
    }
}
