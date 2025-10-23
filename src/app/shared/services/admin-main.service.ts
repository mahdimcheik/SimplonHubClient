import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LocalstorageService } from './localstorage.service';
// import { SSEMainService } from './sseMain.service';

// Generated services and models
import { CookieConsentService } from './cookie-consent.service';
import { EnumGender, GenderDropDown } from '../models/user';
import {
    AuthService,
    ForgotPasswordInput,
    LoginOutputDTO,
    LoginOutputDTOResponseDTO,
    PasswordRecoveryInput,
    PasswordResetResponseDTO,
    PasswordResetResponseDTOResponseDTO,
    RoleAppResponseDTOListResponseDTO,
    RoleAppService,
    StringResponseDTO,
    UserCreateDTO,
    UserInfosWithtoken,
    UserInfosWithtokenResponseDTO,
    UserLoginDTO,
    UserResponseDTO,
    UserResponseDTOListResponseDTO,
    UserResponseDTOResponseDTO,
    UsersService,
    UserUpdateDTO
} from '../../../api';
import { ResponseDTO } from '../models/response-dto';
import { CustomTableState } from '../models/TableColumn ';

/**
 * service pour gérer les utilisateurs.
 * en fonction de leurs roles, les liens de la sidebar changent.
 * Fournit des méthodes pour l'authentification, l'inscription, la gestion des profils, etc. via l'API.
 * Utilise UsersService généré par OpenAPI pour les appels API.
 */
@Injectable({
    providedIn: 'root'
})
export class AdminMainService {
    baseUrl = environment.API_URL;
    private userService = inject(UsersService);

    getUsers(CustomTableState: CustomTableState) {
        try {
            return firstValueFrom(
                this.userService.usersListPost(CustomTableState).pipe(
                    map((response: UserResponseDTOListResponseDTO) => {
                        const legacyResponse: ResponseDTO<UserResponseDTO[]> = {
                            message: response.message || '',
                            status: response.status || 200,
                            data: response.data as UserResponseDTO[],
                            count: response.count || 0
                        };
                        return legacyResponse;
                    })
                )
            );
        } catch (error) {
            console.error('Error loading users:', error);
            return {
                message: 'Erreur lors du chargement des utilisateurs',
                status: 500,
                data: [],
                count: 0
            };
        }
    }

    getTeachers(CustomTableState: CustomTableState) {
        try {
            return firstValueFrom(
                this.userService.usersListTeachersPost(CustomTableState).pipe(
                    map((response: UserResponseDTOListResponseDTO) => {
                        const legacyResponse: ResponseDTO<UserResponseDTO[]> = {
                            message: response.message || '',
                            status: response.status || 200,
                            data: response.data as UserResponseDTO[],
                            count: response.count || 0
                        };
                        return legacyResponse;
                    })
                )
            );
        } catch (error) {
            console.error('Error loading users:', error);
            return {
                message: 'Erreur lors du chargement des utilisateurs',
                status: 500,
                data: [],
                count: 0
            };
        }
    }
}
