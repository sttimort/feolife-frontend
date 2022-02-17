import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillUpsTookitComponent } from './fill-ups-tookit.component';

describe('FillUpsTookitComponent', () => {
  let component: FillUpsTookitComponent;
  let fixture: ComponentFixture<FillUpsTookitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillUpsTookitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FillUpsTookitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
