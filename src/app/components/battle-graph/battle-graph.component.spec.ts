import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleGraphComponent } from './battle-graph.component';

describe('BattleGraphComponent', () => {
  let component: BattleGraphComponent;
  let fixture: ComponentFixture<BattleGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BattleGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
