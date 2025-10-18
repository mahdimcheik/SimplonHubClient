import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserMainService } from '../services/userMain.service';
import { environment } from '../../../environments/environment';
/**
 * @obsolete Pour le developpement uniquement
 * Intercepteur qui ajoute le token d'authentification aux requêtes API.
 * @param req La requête HTTP
 * @param next La fonction pour passer à la prochaine étape
 * @returns La réponse de la requête
 */
export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(UserMainService);
    const token = authService.token();

    // Only add token to API calls (not static assets or other requests)
    const isApiCall = req.url.includes('/api/') || req.url.includes(environment.API_URL);

    // Don't add token to non-API requests or if no token exists
    if (!isApiCall || !token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
};
