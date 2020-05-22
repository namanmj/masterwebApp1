import { TestBed } from '@angular/core/testing';

import { UtilfuncService } from './utilfunc.service';

describe('UtilfuncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilfuncService = TestBed.get(UtilfuncService);
    expect(service).toBeTruthy();
  });
});
