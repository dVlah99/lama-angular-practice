import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJsonPopupComponent } from './edit-json-popup.component';

describe('EditJsonPopupComponent', () => {
  let component: EditJsonPopupComponent;
  let fixture: ComponentFixture<EditJsonPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditJsonPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditJsonPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
