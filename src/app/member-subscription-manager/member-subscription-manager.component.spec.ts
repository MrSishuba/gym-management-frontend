import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSubscriptionManagerComponent } from './member-subscription-manager.component';

describe('MemberSubscriptionManagerComponent', () => {
  let component: MemberSubscriptionManagerComponent;
  let fixture: ComponentFixture<MemberSubscriptionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSubscriptionManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberSubscriptionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
