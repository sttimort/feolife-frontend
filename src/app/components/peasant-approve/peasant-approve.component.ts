import { Component, OnInit } from '@angular/core';
import { FeolifeApiClient } from 'src/app/service/api/feolife-api-client';
import { Peasant } from 'src/app/service/api/model/requests';

@Component({
  selector: 'app-peasant-approve',
  templateUrl: './peasant-approve.component.html',
  styleUrls: ['./peasant-approve.component.scss']
})
export class PeasantApproveComponent implements OnInit {

  
  peasantList: Peasant[] = [];
  
  updateList() {
    this.apiClient.getActualPeasants().subscribe(x=>this.peasantList = x)
  }
  constructor(private apiClient: FeolifeApiClient,) { }

  buttonClick(id:string,type:string){

    this.updateList()
  }


  ngOnInit(): void {
    this.updateList()
  }

}
