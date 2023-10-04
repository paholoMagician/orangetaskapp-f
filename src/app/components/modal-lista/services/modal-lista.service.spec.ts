import { TestBed } from '@angular/core/testing';

import { ModalListaService } from './modal-lista.service';

describe('ModalListaService', () => {
  let service: ModalListaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalListaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
