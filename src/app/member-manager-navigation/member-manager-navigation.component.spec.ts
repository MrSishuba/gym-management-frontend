import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberManagerNavigationComponent } from './member-manager-navigation.component';

describe('MemberManagerNavigationComponent', () => {
  let component: MemberManagerNavigationComponent;
  let fixture: ComponentFixture<MemberManagerNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberManagerNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberManagerNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
