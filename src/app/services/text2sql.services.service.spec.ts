import { TestBed } from '@angular/core/testing';

import { Text2sqlServicesService } from './text2sql.services.service';

describe('Text2sqlServicesService', () => {
  let service: Text2sqlServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Text2sqlServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
