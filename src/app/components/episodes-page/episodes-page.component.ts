import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  NgForOf,
  NgOptimizedImage
} from '@angular/common';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { IEpisodes } from '../../interfaces/IEpisodes';
import { NavigateService } from '../../services/navigate.service';
import { IEpisode } from '../../interfaces/IEpisode';
import { ApiService } from '../../services/api.service';
import { HeaderNavbarComponent } from '../header-navbar/header-navbar.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { ButtonLoadMoreComponent } from '../button-load-more/button-load-more.component';

@Component({
  selector: 'app-episodes-page',
  imports: [
    HeaderNavbarComponent,
    FormsModule,
    NgForOf,
    NgOptimizedImage,
    FooterComponent,
    ButtonLoadMoreComponent
  ],
  templateUrl: './episodes-page.component.html',
  styleUrl: './episodes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EpisodesPageComponent implements OnInit, OnDestroy {
  private readonly _apiService: ApiService = inject(ApiService);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _destroy$: Subject<void> = new Subject<void>();

  protected readonly _navigateService = inject(NavigateService);

  public episodes: IEpisode[] = [];
  public filteredEpisodes: IEpisode[] = [];
  public displayedEpisodes: IEpisode[] = [];

  public visibleCount: number = 12;
  public showLoadMore: boolean = false;
  public nameFilter: string = '';

  public ngOnInit(): void {
    this.loadEpisodes();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public loadEpisodes(): void {
    this._apiService.getAllEpisodes()
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe((episodes: IEpisodes) => {
      this.episodes = episodes.results;
      this.filteredEpisodes = episodes.results;
      this.updateDisplayedEpisodes();
    })
  }

  public filterByName(): void {
    this.filteredEpisodes = this.episodes.filter(episode => {
      return !this.nameFilter ||
        episode.name.toLowerCase().includes(this.nameFilter.toLowerCase()) ||
        episode.episode.toLowerCase().includes(this.nameFilter.toLowerCase());
    });

    this.visibleCount = 12;
    this.updateDisplayedEpisodes();
  }

  public onLoadMore(): void {
    this.visibleCount = this.filteredEpisodes.length;
    this.updateDisplayedEpisodes();
  }

  private updateDisplayedEpisodes(): void {
    this.displayedEpisodes = this.filteredEpisodes.slice(0, this.visibleCount);
    this.showLoadMore = this.filteredEpisodes.length > this.visibleCount;
    this._cdr.markForCheck();
  }
}
