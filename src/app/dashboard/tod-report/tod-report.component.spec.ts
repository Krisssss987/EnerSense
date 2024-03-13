import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodReportComponent } from './tod-report.component';

describe('TodReportComponent', () => {
  let component: TodReportComponent;
  let fixture: ComponentFixture<TodReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
