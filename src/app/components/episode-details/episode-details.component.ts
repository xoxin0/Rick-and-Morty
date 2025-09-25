import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  NgForOf,
  NgOptimizedImage
} from "@angular/common";

import {
  forkJoin,
  Subject,
  switchMap,
  takeUntil
} from 'rxjs';

import { ButtonGoBackComponent } from "../button-go-back/button-go-back.component";
import { HeaderNavbarComponent } from "../header-navbar/header-navbar.component";
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavigateService } from '../../services/navigate.service';
import { IEpisode } from '../../interfaces/IEpisode';
import { ICharacter } from '../../interfaces/ICharacter';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-episode-details',
  imports: [
    ButtonGoBackComponent,
    HeaderNavbarComponent,
    NgForOf,
    NgOptimizedImage,
    FooterComponent
  ],
  templateUrl: './episode-details.component.html',
  styleUrl: './episode-details.component.scss'
})

export class EpisodeDetailsComponent implements OnInit {
  private readonly _apiService: ApiService = inject(ApiService);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private _destroy$: Subject<void> = new Subject<void>();

  protected readonly _navigateService = inject(NavigateService);

  public episodeId: number = this._route.snapshot.params['id'];
  public episode: IEpisode = {} as IEpisode;
  public charactersUrlsArr: string[] = [];
  public charactersData: ICharacter[] = [];

  public ngOnInit(): void {
    this._apiService.getEpisodeById(this.episodeId)
      .pipe(
        switchMap((episode: IEpisode) => {
          this.episode = episode;
          this.charactersUrlsArr = episode.characters;

          const charactersRequests = this.charactersUrlsArr.map(url =>
            this._apiService.getCharacterByUrl(url)
          );

          return forkJoin(charactersRequests);
        }),
        takeUntil(this._destroy$)
      ).subscribe((charactersData: ICharacter[]) => {
        this.charactersData = charactersData;
      })
  }
}
