import { TestBed } from '@angular/core/testing';

import { CosaincegService } from './cosainceg.service';

describe('CosaincegService', () => {
  let service: CosaincegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CosaincegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
