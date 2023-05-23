import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageType } from 'src/app/enums/MessageEnum';
import { HistoryTrip } from 'src/app/models/history-trip';
import { MessageService } from 'src/app/services/message.service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.scss']
})
export class TripHistoryComponent implements OnInit {

  trips: HistoryTrip[];

  constructor(
    private tripService: TripService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.trips = [];
  }

  ngOnInit(): void {
    this.trips = this.tripService.getTripHistory();
  }

  deleteTripFromHistory(historyTrip: HistoryTrip) {
    const deleteCompleted = this.tripService.deleteTripFromHistory(historyTrip);
    if (deleteCompleted) {
      let successMsg = $localize `Trip deleted successfully from history`
      this.messageService.notifyMessage(successMsg, MessageType.SUCCESS);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/trips', 'history']);
      });
    } else {
      let errorMsg = $localize `Something wrong occurred...`;
      this.messageService.notifyMessage(errorMsg, MessageType.DANGER);
    }
  }

  deleteHistory() {
    const confirmMsg = $localize `Are you sure you want to delete the trip history? This action cannot be undone`;
    if (confirm(confirmMsg)) {
      this.tripService.deleteTripHistory();
      const successMsg = $localize `Trip history deleted successfully`
      this.messageService.notifyMessage(successMsg, MessageType.SUCCESS);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/trips', 'history']);
      });
    }
  }

}
