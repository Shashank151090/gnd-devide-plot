import { TestBed } from '@angular/core/testing';

import { ExtractDataService } from './extract-data.service';

describe('ExtractDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtractDataService = TestBed.get(ExtractDataService);
    expect(service).toBeTruthy();
  });
});
