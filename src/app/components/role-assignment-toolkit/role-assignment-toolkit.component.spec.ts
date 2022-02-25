import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAssignmentToolkitComponent } from './role-assignment-toolkit.component';

describe('RoleAssignmentToolkitComponent', () => {
  let component: RoleAssignmentToolkitComponent;
  let fixture: ComponentFixture<RoleAssignmentToolkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleAssignmentToolkitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAssignmentToolkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
