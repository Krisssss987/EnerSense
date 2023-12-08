import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeederConfigurationComponent } from './feeder-configuration.component';

describe('FeederConfigurationComponent', () => {
  let component: FeederConfigurationComponent;
  let fixture: ComponentFixture<FeederConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeederConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeederConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
