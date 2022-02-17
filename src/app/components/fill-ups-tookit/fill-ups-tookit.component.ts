import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExtensibleUserProfile, FeolifeApiClient } from 'src/app/service/feolife-api-client';

interface BillingAccountInfo {
  owner: string,
  uuid: string,
}

@Component({
  selector: 'app-fill-ups-tookit',
  templateUrl: './fill-ups-tookit.component.html',
  styleUrls: ['./fill-ups-tookit.component.scss']
})
export class FillUpsTookitComponent implements OnInit {
  amount: number = 0

  searchResult: ExtensibleUserProfile[] = [];

  searchQueryFormControl = new FormControl('', [
    Validators.required, Validators.pattern(new RegExp('\\S+'))
  ])
  searchForm = new FormGroup({
    query: this.searchQueryFormControl,
  })

  billingAccountInfo: BillingAccountInfo | null = null;

  constructor(
    private apiClient: FeolifeApiClient,
  ) { }

  ngOnInit(): void {
  }

  onSearchFormSumit() {
    const searchQuery = this.searchQueryFormControl.value
    this.apiClient.citizensSearch(searchQuery)
      .subscribe(citizens => {
        this.searchResult = citizens;
      })
  }

  onSelectUserProfile(userProfile: ExtensibleUserProfile) {
    this.apiClient
      .getBillingAccountByUserProfileUuid(userProfile.uuid)
      .subscribe(billingAccount => {
        this.billingAccountInfo = {
          owner: `${userProfile.lastName} ${userProfile.firstName} ${userProfile.middleName ?? ''}`,
          uuid: billingAccount.uuid,
        }
      })
  }

  onFillUp() {
    if (this.billingAccountInfo != null) {
      this.apiClient.fillUpBillingAccount(this.billingAccountInfo.uuid, this.amount).subscribe();
    }
  }
}

export interface Item {
  value: string,
}
