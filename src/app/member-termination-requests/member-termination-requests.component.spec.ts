import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTerminationRequestsComponent } from './member-termination-requests.component';

describe('MemberTerminationRequestsComponent', () => {
  let component: MemberTerminationRequestsComponent;
  let fixture: ComponentFixture<MemberTerminationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberTerminationRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberTerminationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
