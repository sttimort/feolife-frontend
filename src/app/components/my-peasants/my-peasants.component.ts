import { Component, OnInit } from '@angular/core';
import { FeolifeApiClient } from 'src/app/service/api/feolife-api-client';
import { Peasant } from 'src/app/service/api/model/requests';

@Component({
  selector: 'app-my-peasants',
  templateUrl: './my-peasants.component.html',
  styleUrls: ['./my-peasants.component.scss']
})
export class MyPeasantsComponent implements OnInit {

  peasantList: Peasant[] = [];
  
  updateList() {
    this.apiClient.getMyPeasants().subscribe(x=>this.peasantList = x)
  }
  buttonClick(id:string){

    this.apiClient.putToExchange(id).subscribe();
    this.updateList()
  }
  constructor(private apiClient: FeolifeApiClient,) { }

  ngOnInit(): void {
    this.updateList
  }

}
