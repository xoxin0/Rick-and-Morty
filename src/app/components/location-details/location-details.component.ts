import {
  Component,
  inject,
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
import { ButtonGoBackComponent } from '../button-go-back/button-go-back.component';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ILocation } from '../../interfaces/ILocation';
import { ICharacter } from '../../interfaces/ICharacter';
import { NavigateService } from '../../services/navigate.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-location-details',
  imports: [
    HeaderNavbarComponent,
    ButtonGoBackComponent,
    NgForOf,
    NgOptimizedImage,
    FooterComponent
  ],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss'
})

export class LocationDetailsComponent implements OnInit {
  private readonly _apiService: ApiService = inject(ApiService);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private _destroy$: Subject<void> = new Subject<void>();

  protected readonly _navigateService = inject(NavigateService);

  public locationId: number = this._route.snapshot.params['id'];
  public location: ILocation = {} as ILocation;
  public residentsUrlsArr: string[] = [];
  public residentsData: ICharacter[] = [];

  public ngOnInit() {
    this._apiService.getLocationById(this.locationId)
      .pipe(
        switchMap((location: ILocation) => {
          this.location = location;
          this.residentsUrlsArr = location.residents;

          const residentsRequests = this.residentsUrlsArr.map(url =>
            this._apiService.getCharacterByUrl(url)
          );

          return forkJoin(residentsRequests);
        }),
        takeUntil(this._destroy$)
      ).subscribe((residentsData: ICharacter[]) => {
        this.residentsData = residentsData;
      })
  }
}
