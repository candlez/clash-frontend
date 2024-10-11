import { TestBed } from '@angular/core/testing';

import { BattleGraphService } from './battle-graph.service';

describe('BattleGraphService', () => {
  let service: BattleGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
