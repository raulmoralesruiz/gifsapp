import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'app-trending-page',
  // imports: [GifsListComponent],
  templateUrl: './trending-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TrendingPageComponent {
  gifService = inject(GifsService);
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    const precarga = 300;
    const isAtBottom = scrollTop + clientHeight + precarga >= scrollHeight;
    console.log({scrollTotal: scrollTop + clientHeight, scrollHeight, isAtBottom});

    if (isAtBottom) {
      // TODO -> cargar siguiente página de gifs
    }
  }
}
