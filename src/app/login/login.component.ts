import { LoginOverlay } from '@vaadin/vaadin-login';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('overlay') overlay?: any;

  username: string = "fwefef"
  opened: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onLogin(event: CustomEvent) {
    this.close()
  }

  public open() {
    this.opened = true;
  }

  public close() {
    this.opened = false;
  }

}
