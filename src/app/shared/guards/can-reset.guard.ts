import { CanActivateFn } from '@angular/router';

export const canResetGuard: CanActivateFn = (route, state) => {
  return true;
};
