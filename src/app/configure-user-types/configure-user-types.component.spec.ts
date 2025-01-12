import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureUserTypesComponent } from './configure-user-types.component';

describe('ConfigureUserTypesComponent', () => {
  let component: ConfigureUserTypesComponent;
  let fixture: ComponentFixture<ConfigureUserTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureUserTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigureUserTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
