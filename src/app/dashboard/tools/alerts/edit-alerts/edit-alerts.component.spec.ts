import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlertsComponent } from './edit-alerts.component';

describe('EditAlertsComponent', () => {
  let component: EditAlertsComponent;
  let fixture: ComponentFixture<EditAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
