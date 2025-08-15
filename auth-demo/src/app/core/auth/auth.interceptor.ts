import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService) as AuthService;
  
  const isAuthEndpoint = /\/signup$|\/authenticate$/i.test(request.url || '');
  if (isAuthEndpoint) {
    return next(request);
  }

  const token = auth.getToken();
  if (token) {
    const authReq = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(request);
};
