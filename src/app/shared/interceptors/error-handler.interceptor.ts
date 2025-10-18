import { HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { UserMainService } from '../services/userMain.service';
import { environment } from '../../../environments/environment';

/**
 * Interceptor qui gère les erreurs 401 (Unauthorized) en tentant de rafraîchir le token.
 * Si le rafraîchissement échoue, l'utilisateur est déconnecté.
 * Utilisation : dans app.module.ts, ajouter dans les providers :
 */

let isRefreshing = false;

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(UserMainService);

    const isApiCall = req.url.includes('/api/') || req.url.includes(environment.API_URL);

    if (req.url.includes('/refresh-token') || !isApiCall) {
        return next(req);
    }

    return next(req).pipe(
        catchError((err: any) => {
            if (err.status === 401 && !isRefreshing) {
                isRefreshing = true;

                return authService.refreshToken().pipe(
                    catchError((refreshErr) => {
                        isRefreshing = false;
                        authService.reset();
                        return throwError(() => refreshErr);
                    }),
                    switchMap(() => {
                        const clonedRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${authService.token()}`
                            }
                        });
                        return next(clonedRequest);
                    }),
                    finalize(() => {
                        isRefreshing = false;
                    })
                );
            }

            return throwError(() => err);
        })
    ) as Observable<HttpEvent<any>>;
};
