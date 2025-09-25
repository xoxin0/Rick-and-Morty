import {
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  forkJoin,
  Subject,
  switchMap,
  takeUntil
} from 'rxjs';

import {
  NgForOf,
  NgOptimizedImage
} from '@angular/common';

import { HeaderNavbarComponent } from '../header-navbar/header-navbar.component';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ICharacter } from '../../interfaces/ICharacter';
import { IEpisode } from '../../interfaces/IEpisode';
import { ButtonGoBackComponent } from '../button-go-back/button-go-back.component';
import { NavigateService } from '../../services/navigate.service';
import { ILocation } from '../../interfaces/ILocation';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-char-details-page',
  imports: [
    HeaderNavbarComponent,
    NgOptimizedImage,
    NgForOf,
    ButtonGoBackComponent,
    FooterComponent
  ],
  templateUrl: './char-details-page.component.html',
  styleUrl: './char-details-page.component.scss'
})

export class CharDetailsPageComponent implements OnInit, OnDestroy {
  private readonly _apiService: ApiService = inject(ApiService);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private _destroy$: Subject<void> = new Subject<void>();

  protected readonly _navigateService = inject(NavigateService);

  public character: ICharacter = {} as ICharacter;
  public episodesUrlsArr: string[] = [];
  public episodesData: IEpisode[] = [];

  public characterId: number = this._route.snapshot.params['id'];
  public locationUrl: string = '';
  public locationId: number = 0;

  public ngOnInit() {
    this._apiService.getCharacterById(this.characterId)
      .pipe(
        switchMap((character: ICharacter) => {
          this.character = character;
          this.locationUrl = character.location.url;
          this.episodesUrlsArr = character.episode;

          this.requestLocation(this.locationUrl);

          const episodeRequests = this.episodesUrlsArr.map(url =>
            this._apiService.getEpisodeByUrl(url)
          );

          return forkJoin(episodeRequests);
        }),
        takeUntil(this._destroy$)
      ).subscribe((episodesData: IEpisode[]) => {
        this.episodesData = episodesData;
        console.log(this.episodesData);
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public requestLocation(url: string): void {
    this._apiService.getLocationByUrl(url)
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe((location: ILocation) => {
      this.locationId = location.id;
    });
  }
}
