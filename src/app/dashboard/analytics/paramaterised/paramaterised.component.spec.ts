import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamaterisedComponent } from './paramaterised.component';

describe('ParamaterisedComponent', () => {
  let component: ParamaterisedComponent;
  let fixture: ComponentFixture<ParamaterisedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamaterisedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamaterisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
