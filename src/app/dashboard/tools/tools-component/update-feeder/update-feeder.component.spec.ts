import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFeederComponent } from './update-feeder.component';

describe('UpdateFeederComponent', () => {
  let component: UpdateFeederComponent;
  let fixture: ComponentFixture<UpdateFeederComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFeederComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFeederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
