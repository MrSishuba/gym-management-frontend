import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqupimentManagerComponent } from './equpiment-manager.component';

describe('EqupimentManagerComponent', () => {
  let component: EqupimentManagerComponent;
  let fixture: ComponentFixture<EqupimentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EqupimentManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EqupimentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
