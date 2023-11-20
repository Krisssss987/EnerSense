import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegVerifyComponent } from './reg-verify.component';

describe('RegVerifyComponent', () => {
  let component: RegVerifyComponent;
  let fixture: ComponentFixture<RegVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegVerifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
