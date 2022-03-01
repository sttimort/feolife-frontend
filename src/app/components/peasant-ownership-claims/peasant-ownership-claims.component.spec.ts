import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeasantOwnershipClaimsComponent } from './peasant-ownership-claims.component';

describe('PeasantApproveComponent', () => {
  let component: PeasantOwnershipClaimsComponent;
  let fixture: ComponentFixture<PeasantOwnershipClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeasantOwnershipClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeasantOwnershipClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
