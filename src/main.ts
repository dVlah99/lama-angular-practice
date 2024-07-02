import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

async function setup() {
  bootstrapApplication(AppComponent, {
    providers: [
      provideAnimations(),
      importProvidersFrom(),
      provideRouter(
        routes,
        withRouterConfig({ paramsInheritanceStrategy: 'always' })
      ),
      // provideHttpClient(
      //   withXsrfConfiguration({ cookieName: '', headerName: '' }),
      //   withJsonpSupport(),
      //   withInterceptors([
      //     // Add interceptors here
      //     apiInterceptor,
      //     authInterceptor,
      //     errorInterceptor,
      //   ])
      // ),
      { provide: LOCALE_ID, useValue: 'hr-HR' },
      provideToastr({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        countDuplicates: true,
        resetTimeoutOnDuplicate: true,
        enableHtml: true,
        progressBar: true,
        closeButton: true,
        timeOut: 5000,
      }),
      importProvidersFrom(ToastModule),
      // importProvidersFrom(ConfirmDialogModule),
      // importProvidersFrom(FormlyModule.forRoot()),
      // provideEnvironmentNgxMask(() => ({
      //   validation: false,
      //   showMaskTyped: true,
      // })),
      ConfirmationService,
      MessageService,
      DialogService,
      // provideConfig(config),
      PrimeNGConfig,
    ],
  }).catch((err) => console.error(err));
}

setup();
