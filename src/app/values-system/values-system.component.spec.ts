import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesSystemComponent } from './values-system.component';

describe('ValuesSystemComponent', () => {
  let component: ValuesSystemComponent;
  let fixture: ComponentFixture<ValuesSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValuesSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValuesSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
