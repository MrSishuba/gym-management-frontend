import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteContractFileComponent } from './delete-contract-file.component';

describe('DeleteContractFileComponent', () => {
  let component: DeleteContractFileComponent;
  let fixture: ComponentFixture<DeleteContractFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteContractFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteContractFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
