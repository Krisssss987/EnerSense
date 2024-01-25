import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeederComponent } from './add-feeder.component';

describe('AddFeederComponent', () => {
  let component: AddFeederComponent;
  let fixture: ComponentFixture<AddFeederComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeederComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFeederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
