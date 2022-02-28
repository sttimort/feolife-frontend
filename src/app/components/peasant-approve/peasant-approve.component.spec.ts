import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeasantApproveComponent } from './peasant-approve.component';

describe('PeasantApproveComponent', () => {
  let component: PeasantApproveComponent;
  let fixture: ComponentFixture<PeasantApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeasantApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeasantApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
