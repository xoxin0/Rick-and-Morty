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

import { HeaderNavbarComponent } from "../header-navbar/header-navbar.component";
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NavigateService } from '../../services/navigate.service';
import { ILocation } from '../../interfaces/ILocation';
import { ILocations } from '../../interfaces/ILocations';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-locations-page',
  imports: [
    HeaderNavbarComponent,
    FormsModule,
    NgOptimizedImage,
    NgForOf,
    FooterComponent
  ],
  templateUrl: './locations-page.component.html',
  styleUrl: './locations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LocationsPageComponent implements OnInit, OnDestroy {
  private readonly _apiService: ApiService = inject(ApiService);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _destroy$: Subject<void> = new Subject<void>();

  protected readonly _navigateService = inject(NavigateService);

  public locations: ILocation[] = [];
  public filteredLocations: ILocation[] = [];

  public nameFilter: string = '';
  public typeFilter: string = '';
  public dimensionFilter: string = '';

  public ngOnInit(): void {
    this.loadLocations();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public loadLocations(): void {
    this._apiService.getAllLocations()
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe((locations: ILocations) => {
      this.locations = locations.results;
      this.filteredLocations = this.locations;
      this._cdr.markForCheck();
    })
  }

  public applyFilters(): void {
    this.filteredLocations = this.locations.filter(location => {
      const matchesName = !this.nameFilter ||
        location.name.toLowerCase().includes(this.nameFilter.toLowerCase());

      const matchesType = !this.typeFilter ||
        location.type.toLowerCase() === this.typeFilter.toLowerCase();

      const matchesDimension = !this.dimensionFilter ||
        location.dimension.toLowerCase() === this.dimensionFilter.toLowerCase();

      return matchesName && matchesType && matchesDimension;
    });

    this._cdr.markForCheck();
  }
}
