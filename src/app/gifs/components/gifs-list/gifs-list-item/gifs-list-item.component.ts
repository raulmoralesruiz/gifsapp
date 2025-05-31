import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gifs-list-item',
  imports: [],
  templateUrl: './gifs-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifsListItemComponent {
  // imageUrl: string; otro input
  imageUrl = input.required<string>();
}
