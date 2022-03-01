import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, PrimeIcons, SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { PeasantOwnershipClaim, PeasantOwnershipClaimPeasant, PeasantOwnershipClaimStatus } from 'src/app/service/api/model/api-models';
import { PeasantOwnershipClaimService } from 'src/app/service/peasant-ownership-claim.service';
import { State } from 'src/app/store/state';

@Component({
  selector: 'app-peasant-ownership-claims',
  templateUrl: './peasant-ownership-claims.component.html',
  styleUrls: ['./peasant-ownership-claims.component.scss'],
  providers: [ConfirmationService],
})
export class PeasantOwnershipClaimsComponent implements OnInit {

  claimStatusOptions: SelectItem<PeasantOwnershipClaimStatus | null>[] = [
    { label: 'Любой', value: null },
    { label: 'Создана', value: PeasantOwnershipClaimStatus.CREATED },
    { label: 'На рассмотрении', value: PeasantOwnershipClaimStatus.IN_REVIEW },
    { label: 'Одобрена', value: PeasantOwnershipClaimStatus.APPROVED },
    { label: 'Отказано', value: PeasantOwnershipClaimStatus.REJECTED },
  ]

  selectedClaimStatus: PeasantOwnershipClaimStatus | null = null;

  claims: PeasantOwnershipClaim[] = [];
  claimsTotal = 0;

  isFullClaimInfoDialogVisible: boolean = false
  selectedClaim: PeasantOwnershipClaim | null = null;

  constructor(
    private peasantOwnershipClaimService: PeasantOwnershipClaimService,
    private confirmationService: ConfirmationService,
    private store: Store<{ state: State }>,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onLazyLoad(event: { first: number, rows: number }) {
    this.loadClaims({ start: event.first, size: event.rows })
  }

  onSelectedCLaimStatusChange() {
    this.loadClaims({ start: 0, size: 10 })
  }

  getSeverityForClaimStatus(status: PeasantOwnershipClaimStatus): string {
    if (status == PeasantOwnershipClaimStatus.APPROVED) return 'success'
    else if (status == PeasantOwnershipClaimStatus.REJECTED) return 'danger'
    else if (status == PeasantOwnershipClaimStatus.CREATED) return 'warning'
    else return 'info';
  }

  buildPeasantDescription(peasant: PeasantOwnershipClaimPeasant) {
    let fullName = `${peasant.firstName} ${peasant.lastName} ${peasant.middleName ?? ''}`

    let additionalInfo = ''
    if (peasant.gender != null) {
      additionalInfo = peasant.gender
    }


    if (peasant.birthDate != null) {
      if (additionalInfo.length > 0) {
        additionalInfo += ', '
      }
      additionalInfo += `${peasant.birthDate.getFullYear()} г.р.`
    }

    if (peasant.birthPlace != null) {
      if (additionalInfo.length > 0) {
        additionalInfo += ', '
      }
      additionalInfo += `м.р. – ${peasant.birthPlace}`
    }

    return `${fullName} ${additionalInfo.length > 0 ? `(${additionalInfo})` : ''}`
  }

  onShowFullInfo(claim: PeasantOwnershipClaim) {
    this.selectedClaim = claim
    this.isFullClaimInfoDialogVisible = true
  }

  onStartReview(event: Event, claim: PeasantOwnershipClaim) {
    this.confirmationService.confirm({
      target: event.target ?? undefined,
      message: 'Перевести заявку в статус "Рассматривается" и перейти к рассмотрению?',
      icon: PrimeIcons.QUESTION,
      accept: () => {
        this.peasantOwnershipClaimService
          .initiateStartReview(claim.uuid)
          .subscribe(() => {
            this.router.navigateByUrl(`peasant-ownership-claims/${claim.uuid}/review`)
          })
      },
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
    })
  }

  isClaimResolved(status: PeasantOwnershipClaimStatus): boolean {
    return status == PeasantOwnershipClaimStatus.APPROVED || status == PeasantOwnershipClaimStatus.REJECTED
  }

  canStartReview(status: PeasantOwnershipClaimStatus): boolean {
    return status == PeasantOwnershipClaimStatus.CREATED
  }

  canContinueReview(claim: PeasantOwnershipClaim): Observable<boolean> {
    return this.store
      .select(it => it.state.profile?.uuid != null &&
        it.state.profile.uuid == claim.reviewer?.uuid &&
        claim.status == PeasantOwnershipClaimStatus.IN_REVIEW
      )
  }

  onContinuteReview(claim: PeasantOwnershipClaim) {
    this.router.navigateByUrl(`peasant-ownership-claims/${claim.uuid}/review`)
  }

  private loadClaims(paging: { start: number, size: number }) {
    this.peasantOwnershipClaimService
      .initiateGetClaims({ claimStatus: this.selectedClaimStatus, start: paging.start, size: paging.size })
      .subscribe(({ claims, totalCount }) => {
        console.log(claims)
        this.claims = claims
        this.claimsTotal = totalCount
      })
  }
}
