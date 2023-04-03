import { MessageService } from './../../../services/message.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InfoMessage } from 'src/app/models/info-message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  protected infoMessage!: string;
  protected cssClass!: string;
  protected showMessage!: boolean;
  private subscription!: Subscription;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(
      (data: InfoMessage | null) => {
        if (data) {
          this.infoMessage = data.infoMessage;
          this.cssClass = data.cssClass;
          this.showMessage = true;
        } else {
          this.showMessage = false;
        }
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
