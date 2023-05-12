import { MessageType } from 'src/app/enums/MessageEnum';
import { ApplicationService } from './../../../services/application.service';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Status } from 'src/app/enums/StatusEnum';
import { Actor } from 'src/app/models/actor';
import { ApplicationsByStatus } from 'src/app/models/applications-by-status';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-explorer-applications',
  templateUrl: './explorer-applications.component.html',
  styleUrls: ['./explorer-applications.component.scss']
})
export class ExplorerApplicationsComponent implements OnInit {

  actor: Actor;
  applicationsByStatus: ApplicationsByStatus[];

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private messageService: MessageService) {
    this.actor = new Actor();
    this.applicationsByStatus = [];
  }

  ngOnInit(): void {
    this.actor = this.authService.getCurrentActor();
    this.applicationService.getApplicationsByStatus().subscribe(appsByStatus => {
      this.applicationsByStatus = appsByStatus;
    })
  }

  cancelApplication(applicationId: string) {
    this.applicationService.cancelApplication(applicationId).subscribe({
      next: () => {
        this.messageService.notifyMessage($localize`Application cancelled`, MessageType.SUCCESS);
        location.reload();
      },
      error: (err) => {
        this.messageService.notifyMessage($localize`An error has occurred while cancellation`, MessageType.DANGER);
        console.log(err);
      }
    })
  }

  getCommentsText(comments: string) {
    return comments ? comments : $localize`No comments`;
  }

  getStatusName(st: Status) {
    return this.applicationService.getStatusName(st);
  }

}
