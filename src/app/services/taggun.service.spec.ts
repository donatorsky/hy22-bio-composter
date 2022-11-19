import { TestBed } from '@angular/core/testing';

import { TaggunService } from './taggun.service';

describe('TaggunService', () => {
  let service: TaggunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaggunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
