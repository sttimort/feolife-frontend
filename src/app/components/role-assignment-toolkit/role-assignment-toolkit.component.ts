import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ExtensibleUserProfile, FeolifeApiClient, Role } from 'src/app/service/api/feolife-api-client';

@Component({
  selector: 'app-role-assignment-toolkit',
  templateUrl: './role-assignment-toolkit.component.html',
  styleUrls: ['./role-assignment-toolkit.component.scss']
})
export class RoleAssignmentToolkitComponent implements OnInit {

  searchResult: ExtensibleUserProfile[] = [];
  searchQueryFormControl = new FormControl('', [
    Validators.required, Validators.pattern(new RegExp('\\S+'))
  ])
  searchForm = new FormGroup({
    query: this.searchQueryFormControl,
  })

  selectedUserProfile: ExtensibleUserProfile | null = null;

  rolesPickPool: { uuid: string, name: string }[] = [];
  selectedRoles: { uuid: string, name: string }[] = [];


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
    this.selectedUserProfile = userProfile;
    forkJoin({
      allRoles: this.apiClient.getRoles(),
      userProfileRoles: this.apiClient.getUserProfileRoles(userProfile.uuid),
    }).subscribe(({ allRoles, userProfileRoles }) => {
      this.rolesPickPool = allRoles.filter(role => !userProfileRoles.some(it => it.uuid == role.uuid));
      this.selectedRoles = userProfileRoles;
    });
  }

  onAssignRoles() {
    if (this.selectedUserProfile != null) {
      this.apiClient
        .assignRoles(this.selectedUserProfile.uuid, this.selectedRoles.map(it => it.uuid))
        .subscribe();
    }
  }
}
