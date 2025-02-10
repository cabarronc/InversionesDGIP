import { TestBed } from '@angular/core/testing';

import { AdecuacionesService } from './adecuaciones.service';

describe('AdecuacionesService', () => {
  let service: AdecuacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdecuacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
