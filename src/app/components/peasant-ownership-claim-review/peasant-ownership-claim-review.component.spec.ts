import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeasantOwnershipClaimReviewComponent } from './peasant-ownership-claim-review.component';

describe('PeasantOwnershipClaimReviewComponent', () => {
  let component: PeasantOwnershipClaimReviewComponent;
  let fixture: ComponentFixture<PeasantOwnershipClaimReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeasantOwnershipClaimReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeasantOwnershipClaimReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
