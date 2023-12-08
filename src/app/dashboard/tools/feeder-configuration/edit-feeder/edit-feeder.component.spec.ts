import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeederComponent } from './edit-feeder.component';

describe('EditFeederComponent', () => {
  let component: EditFeederComponent;
  let fixture: ComponentFixture<EditFeederComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFeederComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFeederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
