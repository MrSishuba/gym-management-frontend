import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkEthicsComponent } from './work-ethics.component';

describe('WorkEthicsComponent', () => {
  let component: WorkEthicsComponent;
  let fixture: ComponentFixture<WorkEthicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkEthicsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkEthicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
