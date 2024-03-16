import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendVerifyComponent } from './resend-verify.component';

describe('ResendVerifyComponent', () => {
  let component: ResendVerifyComponent;
  let fixture: ComponentFixture<ResendVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendVerifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
