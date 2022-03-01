import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { PeasantOwnershipClaim, PeasantOwnershipClaimStatus } from 'src/app/service/api/model/api-models';
import { PeasantOwnershipClaimService } from 'src/app/service/peasant-ownership-claim.service';
import { State } from 'src/app/store/state';

@Component({
  selector: 'app-peasant-ownership-claim-review',
  templateUrl: './peasant-ownership-claim-review.component.html',
  styleUrls: ['./peasant-ownership-claim-review.component.scss'],
  providers: [ConfirmationService]
})
export class PeasantOwnershipClaimReviewComponent implements OnInit {

  private resolutionCommentFormControl = new FormControl('', [
    Validators.required
  ])

  claimUuid!: string
  claim: PeasantOwnershipClaim | null = null

  resolutionForm = new FormGroup({
    resolutionComment: this.resolutionCommentFormControl,
  })

  constructor(
    private route: ActivatedRoute,
    private peasantOwnershipClaimService: PeasantOwnershipClaimService,
    private confirmationService: ConfirmationService,
    private store: Store<{ state: State }>,
  ) { }

  ngOnInit(): void {
    const claimUuid = this.route.snapshot.paramMap.get('uuid');
    if (claimUuid) {
      this.claimUuid = claimUuid
      this.loadClaim(claimUuid)
    }
  }

  getSeverityForClaimStatus(status: PeasantOwnershipClaimStatus): string {
    if (status == PeasantOwnershipClaimStatus.APPROVED) return 'success'
    else if (status == PeasantOwnershipClaimStatus.REJECTED) return 'danger'
    else if (status == PeasantOwnershipClaimStatus.CREATED) return 'warning'
    else return 'info';
  }

  isClaimResolved(status: PeasantOwnershipClaimStatus): boolean {
    return status == PeasantOwnershipClaimStatus.APPROVED || status == PeasantOwnershipClaimStatus.REJECTED
  }

  canMakeResolution(): Observable<boolean> {
    return this.store
      .select(it => this.claim != null &&
        this.claim.status == PeasantOwnershipClaimStatus.IN_REVIEW &&
        this.claim.reviewer != null &&
        this.claim.reviewer.uuid == it.state.profile?.uuid
      )
  }

  onApproveClicked() {
    if (this.claim != null && this.resolutionForm.valid) {
      const claim = this.claim
      this.confirmationService.confirm({
        header: 'Одобрить заявку?',
        message: 'Подтвердите одобрение заявления. После одорения владения в автоматическом режиме ' +
          'будет заргистрировано и крепостной будет отображаться в наличии у помещика.',
        icon: PrimeIcons.CHECK,
        acceptLabel: 'Подтвердить',
        acceptButtonStyleClass: 'p-button-success',
        rejectLabel: 'Отменить',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.peasantOwnershipClaimService
            .initiateApproval(claim.uuid, this.resolutionCommentFormControl.value)
            .subscribe(() => this.loadClaim(this.claimUuid))
        }
      })
    }
  }

  onRejectClicked() {
    if (this.claim != null && this.resolutionForm.valid) {
      const claim = this.claim
      this.confirmationService.confirm({
        header: 'Отказать в одобрении заявки?',
        message: 'Подтвердите отказ в одобрении.',
        icon: PrimeIcons.BAN,
        acceptLabel: 'Подтвердить отказ',
        acceptButtonStyleClass: 'p-button-danger',
        rejectLabel: 'Отменить',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.peasantOwnershipClaimService
          .initiateRejection(claim.uuid, this.resolutionCommentFormControl.value)
          .subscribe(() => this.loadClaim(this.claimUuid))
        }
      })
    }
  }

  private loadClaim(claimUuid: string) {
    this.peasantOwnershipClaimService
        .initiateGetClaim(claimUuid)
        .subscribe(it => this.claim = it)
  }
}
