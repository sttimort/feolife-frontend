import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloSidebarComponent } from './hello-sidebar.component';

describe('HelloSidebarComponent', () => {
  let component: HelloSidebarComponent;
  let fixture: ComponentFixture<HelloSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelloSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
