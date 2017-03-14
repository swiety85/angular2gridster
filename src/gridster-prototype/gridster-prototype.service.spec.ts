/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GridsterPrototypeService } from './gridster-prototype.service';

describe('GridsterPrototypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridsterPrototypeService]
    });
  });

  it('should ...', inject([GridsterPrototypeService], (service: GridsterPrototypeService) => {
    expect(service).toBeTruthy();
  }));
});
