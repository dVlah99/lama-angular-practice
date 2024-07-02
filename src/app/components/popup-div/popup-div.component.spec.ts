import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDivComponent } from './popup-div.component';

describe('PopupDivComponent', () => {
  let component: PopupDivComponent;
  let fixture: ComponentFixture<PopupDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupDivComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
