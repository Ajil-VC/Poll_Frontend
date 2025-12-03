import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { pollResolver } from './poll.resolver';

describe('pollResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => pollResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
