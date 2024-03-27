import { TestBed } from '@angular/core/testing';

import { EmailGuard } from './email.guard';

describe('EmailGuard', () => {
  let guard: EmailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EmailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
