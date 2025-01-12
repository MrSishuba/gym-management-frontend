import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedFreeTrialsComponent } from './issued-free-trials.component';

describe('IssuedFreeTrialsComponent', () => {
  let component: IssuedFreeTrialsComponent;
  let fixture: ComponentFixture<IssuedFreeTrialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedFreeTrialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssuedFreeTrialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
