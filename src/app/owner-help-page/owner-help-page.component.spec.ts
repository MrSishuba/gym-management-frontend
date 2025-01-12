import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerHelpPageComponent } from './owner-help-page.component';

describe('OwnerHelpPageComponent', () => {
  let component: OwnerHelpPageComponent;
  let fixture: ComponentFixture<OwnerHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerHelpPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
