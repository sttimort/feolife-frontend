import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPeasantsComponent } from './my-peasants.component';

describe('MyPeasantsComponent', () => {
  let component: MyPeasantsComponent;
  let fixture: ComponentFixture<MyPeasantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPeasantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPeasantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
