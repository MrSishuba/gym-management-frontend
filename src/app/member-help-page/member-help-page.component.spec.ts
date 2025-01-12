import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHelpPageComponent } from './member-help-page.component';

describe('MemberHelpPageComponent', () => {
  let component: MemberHelpPageComponent;
  let fixture: ComponentFixture<MemberHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberHelpPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
