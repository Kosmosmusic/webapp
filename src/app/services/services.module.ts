import { NgModule, ModuleWithProviders } from "@angular/core";

import { CustomServiceWorkerService } from 'src/app/services/service-worker/custom-service-worker.service';
import { CustomDeferredService } from 'src/app/services/deferred/custom-deferred.service';
import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';
import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { UserInterfaceUtilsService } from 'src/app/services/ui-utils/user-interface-utils.service';

import { GoogleApiService } from 'src/app/services/google-api/google-api.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';
import { SendDemoService } from 'src/app/services/send-demo/send-demo.service';
import { SendMasteringOrderService } from 'src/app/services/send-mastering-order/send-mastering-order.service';
import { SendBookingRequestService } from 'src/app/services/send-booking-request/send-booking-request.service';
import { EmailSubscriptionService } from 'src/app/services/email-subscription/email-subscription.service';
import { SoundcloudService } from 'src/app/services/soundcloud/soundcloud.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { AppSpinnerService } from './spinner/spinner.service';

@NgModule({})
export class AppServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppServicesModule,
      providers: [
        CustomServiceWorkerService,
        CustomDeferredService,
        CustomHttpHandlersService,
        AppSpinnerService,
        EventEmitterService,
        UserInterfaceUtilsService,
        GoogleApiService,
        FirebaseService,
        SendEmailService,
        SendDemoService,
        SendMasteringOrderService,
        SendBookingRequestService,
        EmailSubscriptionService,
        SoundcloudService,
        FacebookService
      ]
    };
  }
}
