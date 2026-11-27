import { TestBed } from '@angular/core/testing';

import { AilaService } from './aila.service';

describe('AilaService', () => {
  let service: AilaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AilaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
