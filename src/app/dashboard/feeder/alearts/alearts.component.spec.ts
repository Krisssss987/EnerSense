import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AleartsComponent } from './alearts.component';

describe('AleartsComponent', () => {
  let component: AleartsComponent;
  let fixture: ComponentFixture<AleartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AleartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AleartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
