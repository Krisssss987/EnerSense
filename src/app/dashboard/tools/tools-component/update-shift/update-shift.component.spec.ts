import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShiftComponent } from './update-shift.component';

describe('UpdateShiftComponent', () => {
  let component: UpdateShiftComponent;
  let fixture: ComponentFixture<UpdateShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
