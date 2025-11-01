import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { canNotLoginGuard, isConnectedGuard, isNotConnectedGuard } from './app/shared/guards/can-login.guard';

// Auth components
import { AuthLayoutComponent } from './app/modules/auth/pages/auth-layout/auth-layout.component';
import { LoginComponent } from './app/modules/auth/pages/login/login.component';
import { ForgotPasswordComponent } from './app/modules/auth/pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './app/modules/auth/pages/change-password/change-password.component';
import { AccountConfirmationComponent } from './app/modules/auth/pages/account-confirmation/account-confirmation.component';
import { InscriptionComponent } from './app/modules/auth/pages/inscription/inscription.component';
import { AccountCreatedSuccessfullyComponent } from './app/modules/auth/pages/account-created-successfully/account-created-successfully.component';
import { PasswordResetSuccessfullyComponent } from './app/modules/auth/pages/password-reset-successfully/password-reset-successfully.component';

// Landing components
import { MainComponent } from './app/pages/landing/sub-pages/main/main.component';
import { MentionsLegalesComponent } from './app/pages/landing/sub-pages/mentions-legales/mentions-legales.component';
import { ProfileTeacherComponent } from './app/modules/teacher/pages/profile-teacher/profile-teacher.component';
import { UsersListComponent } from './app/modules/admin/pages/users-list/users-list.component';
import { CalendarTeacherComponent } from './app/modules/teacher/pages/calendar-teacher/calendar-teacher.component';
import { GestionCursusesComponent } from './app/modules/teacher/pages/gestion-cursuses/gestion-cursuses.component';
import { AdminitrationComponent } from './app/modules/admin/pages/adminitration/adminitration.component';
import { CalendarStudentComponent } from './app/modules/student/pages/calendar-student/calendar-student.component';
import { TeacherListComponent } from './app/modules/student/pages/teacher-list/teacher-list.component';

// Define path constants
const TEACHER_PATH = 'teacher';
const ADMIN_PATH = 'admin';
const STUDENT_PATH = 'student';
const SETTINGS_PATH = 'settings';
const CONTACT_PATH = 'contact';
const RESERVATION_PATH = 'reservation';
const PROFILE_PATH = 'profile';

export const appRoutes: Routes = [
    // Landing routes
    {
        path: '',
        component: Landing,
        children: [
            {
                path: '',
                component: MainComponent
            },
            {
                path: 'mentions-legales',
                component: MentionsLegalesComponent
            }
        ]
    },

    // Auth routes
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canActivate: [isNotConnectedGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password',
                component: ChangePasswordComponent
            },
            {
                path: 'email-confirmation-success',
                component: AccountConfirmationComponent
            },
            {
                path: 'inscription',
                component: InscriptionComponent
            },
            {
                path: 'account-created-successfully',
                component: AccountCreatedSuccessfullyComponent
            },
            {
                path: 'password-reset-successfully',
                component: PasswordResetSuccessfullyComponent
            }
        ]
    },

    // Dashboard routes (protected)
    {
        path: TEACHER_PATH,
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            // Settings
            { path: '', component: CalendarTeacherComponent },
            { path: SETTINGS_PATH, component: SettingsComponent },
            { path: PROFILE_PATH + '/:id', component: ProfileTeacherComponent },
            { path: RESERVATION_PATH + '/list', component: UsersListComponent },
            { path: CONTACT_PATH, component: GestionCursusesComponent }
        ]
    },

    // Dashboard routes (protected)
    {
        path: ADMIN_PATH,
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            { path: SETTINGS_PATH, component: SettingsComponent },
            { path: 'users-list', component: UsersListComponent },
            { path: 'adminitration', component: AdminitrationComponent }
        ]
    },
    {
        path: STUDENT_PATH,
        component: AppLayout,
        canActivate: [isConnectedGuard],
        children: [
            { path: 'calendar-student', component: CalendarStudentComponent },
            { path: 'list-teachers', component: TeacherListComponent }
        ]
    },

    {
        path: 'notfound',
        component: Notfound
    },

    { path: '**', redirectTo: '/notfound' }
];
