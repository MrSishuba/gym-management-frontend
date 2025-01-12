import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSideNavBarComponent } from './master-side-nav-bar.component';

describe('MasterSideNavBarComponent', () => {
  let component: MasterSideNavBarComponent;
  let fixture: ComponentFixture<MasterSideNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterSideNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterSideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
