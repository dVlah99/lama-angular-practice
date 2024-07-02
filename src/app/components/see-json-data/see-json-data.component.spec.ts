import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeJsonDataComponent } from './see-json-data.component';

describe('SeeJsonDataComponent', () => {
  let component: SeeJsonDataComponent;
  let fixture: ComponentFixture<SeeJsonDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeJsonDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeeJsonDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
