import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadGifsFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse( gifsFromLocalStorage );

  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifsService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>( () => {
    const groups = [];

    for (let i = 0; i < this.trendingGifs().length; i+=3) {
      groups.push( this.trendingGifs().slice(i, i+3) );
    }

    return groups;
  })

  searchHistory = signal<Record<string, Gif[]>>( loadGifsFromLocalStorage() );
  searchHistoryKeys = computed( () => Object.keys( this.searchHistory() ));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect( () => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return;
    this.trendingGifsLoading.set(true);
    const url = `${environment.giphyUrl}/gifs/trending`;

    this.http.get<GiphyResponse>(url, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20,
      }
    }).subscribe((response) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
      this.trendingGifs.update(currentGifs => [
        ...currentGifs, ...gifs
      ]);
      this.trendingPage.update(page => page + 1);
      this.trendingGifsLoading.set(false);
    })
  }

  searchGifs(query: string) {
    const url = `${environment.giphyUrl}/gifs/search`;

    return this.http.get<GiphyResponse>(url, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query
      }
    })
    .pipe(
      map( ({data}) => data),
      map( (giphyItems) => GifMapper.mapGiphyItemsToGifArray(giphyItems)),

      // Historial
      tap(giphyItems => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: giphyItems,
        }));
      })
    );
  }

  getHistoryGifs( query: string ) {
    return this.searchHistory()[query] ?? [];
  }

}
