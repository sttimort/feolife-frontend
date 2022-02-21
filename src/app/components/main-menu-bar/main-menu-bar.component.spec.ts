import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuBarComponent } from './main-menu-bar.component';

describe('MainMenuBarComponent', () => {
  let component: MainMenuBarComponent;
  let fixture: ComponentFixture<MainMenuBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainMenuBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
