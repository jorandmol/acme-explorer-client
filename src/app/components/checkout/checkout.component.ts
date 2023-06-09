import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { MessageType } from 'src/app/enums/MessageEnum';
import { Trip } from 'src/app/models/trip';
import { ApplicationService } from 'src/app/services/application.service';
import { MessageService } from 'src/app/services/message.service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  tripId!: string;
  applicationId!: string;
  trip: Trip;
  paymentError = '';
  paymentSuccess = '';


  protected paypalConfig?: IPayPalConfig;

  constructor(
    private tripService: TripService,
    private applicationService: ApplicationService,
    private messageService: MessageService,
  ) {
    this.trip = new Trip();
  }

  ngOnInit(): void {
    // wait for the buttons to be rendered
    setTimeout(() => {
      this.addPayButtonClickListeners();
    }, 1000);
  };

  addPayButtonClickListeners() {
    // add click event listener to every pay button
    const payButtons = document.querySelectorAll('.pay-button');
    payButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const ids = button.id.split('App')[1].split('Trip');
        this.applicationId = ids[0];
        this.tripId = ids[1];
        this.paymentError = '';
        this.paymentSuccess = '';
        this.paypalConfig = undefined;

        this.tripService.getTrip(this.tripId).subscribe((data) => {
          this.trip = data;
          if (new Date(this.trip.startDate) < new Date()) {
            this.paymentError = $localize`This trip has already started, you should cancel your application`;
          } else if (this.trip.cancellationDate) {
            this.paymentError = $localize`This trip has been cancelled, you should cancel your application`;
          } else {
            this.initConfig();
          }
        });
      });
    });
  }

  initConfig() {
    this.paypalConfig = {
      currency: 'EUR',
      clientId: 'Ab__u9GW7QdCsUcMTjNUZhuY1Nj6KQptxT6_tkZW7RkhaWpVvF4n9hcx4SZuS6SH2Pc3xo0V2-F_w9BH',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: this.trip?.price.toString() || '9.99',
          }
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.applicationService.payApplication(this.applicationId)
          .subscribe({
            next: () => {
              this.paymentSuccess = $localize`Payment successful`;
              this.paypalConfig = undefined;
              document.getElementById('modalClose')?.click();
              location.reload();
            },
            error: (err) => {
              console.log(err);
            }
          });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    }
  };
}
