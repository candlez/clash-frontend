import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { BattleGraphService } from '../../services/battle-graph.service';

@Component({
  selector: 'app-battle-graph',
  standalone: true,
  imports: [],
  providers: [BattleGraphService],
  templateUrl: './battle-graph.component.html',
  styleUrl: './battle-graph.component.scss'
})
export class BattleGraphComponent implements AfterViewInit, OnDestroy {
  @ViewChild("battleGraph") private canvas!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D;
  private resizeObserver!: ResizeObserver;

  constructor(private displayService: BattleGraphService) {

  }

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.context = this.canvas.nativeElement.getContext("2d")!;
    } else {
      // this should be an error
    }
    this.displayService.init(this.canvas, this.context);
    this.resizeObserver = new ResizeObserver(entries => {
      this.displayService.requestSizeCalibration();
    });
    this.resizeObserver.observe(this.canvas.nativeElement);
  }

  ngOnDestroy(): void {
      this.resizeObserver.disconnect();
  }
}
