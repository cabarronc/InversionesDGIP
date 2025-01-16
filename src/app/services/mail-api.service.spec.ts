import { TestBed } from '@angular/core/testing';

import { MailApiService } from './mail-api.service';

describe('MailApiService', () => {
  let service: MailApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
