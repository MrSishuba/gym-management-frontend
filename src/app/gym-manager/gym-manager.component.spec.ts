import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymManagerComponent } from './gym-manager.component';

describe('GymManagerComponent', () => {
  let component: GymManagerComponent;
  let fixture: ComponentFixture<GymManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GymManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
