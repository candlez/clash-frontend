import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BattleGraphComponent } from './components/battle-graph/battle-graph.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BattleGraphComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
