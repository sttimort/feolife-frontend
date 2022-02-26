import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPeasantComponent } from './set-peasant.component';

describe('SetPeasantComponent', () => {
  let component: SetPeasantComponent;
  let fixture: ComponentFixture<SetPeasantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPeasantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPeasantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
