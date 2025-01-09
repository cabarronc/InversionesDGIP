import { TestBed } from '@angular/core/testing';

import { ApiIaService } from './api-ia.service';

describe('ApiIaService', () => {
  let service: ApiIaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiIaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
