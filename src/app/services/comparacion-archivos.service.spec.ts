import { TestBed } from '@angular/core/testing';

import { ComparacionArchivosService } from './comparacion-archivos.service';

describe('ComparacionArchivosService', () => {
  let service: ComparacionArchivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparacionArchivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
