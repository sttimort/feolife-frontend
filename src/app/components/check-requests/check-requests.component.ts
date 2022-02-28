import { Component, OnInit } from '@angular/core';
import { FeolifeApiClient } from 'src/app/service/api/feolife-api-client';
import { PeasantRequest } from 'src/app/service/api/model/requests';

@Component({
  selector: 'app-check-requests',
  templateUrl: './check-requests.component.html',
  styleUrls: ['./check-requests.component.scss']
})
export class CheckRequestsComponent implements OnInit {

  peasantList: PeasantRequest[] = [];
  constructor(private apiClient: FeolifeApiClient,) { }

  ngOnInit(): void {
    this.apiClient.getPeasantRequestSateList().subscribe(x=>this.peasantList =x)
  }

}
