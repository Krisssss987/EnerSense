import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsuptionComponent } from './consuption.component';

describe('ConsuptionComponent', () => {
  let component: ConsuptionComponent;
  let fixture: ComponentFixture<ConsuptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsuptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsuptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
