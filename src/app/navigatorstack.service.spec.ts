import { TestBed } from '@angular/core/testing';

import { NavigatorstackService } from './navigatorstack.service';

describe('NavigatorstackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigatorstackService = TestBed.get(NavigatorstackService);
    expect(service).toBeTruthy();
  });
});
