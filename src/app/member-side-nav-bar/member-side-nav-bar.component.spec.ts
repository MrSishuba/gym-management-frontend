import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSideNavBarComponent } from './member-side-nav-bar.component';

describe('MemberSideNavBarComponent', () => {
  let component: MemberSideNavBarComponent;
  let fixture: ComponentFixture<MemberSideNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSideNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberSideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
