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
  debounceTime, distinctUntilChanged,
  Subject,
  takeUntil
} from 'rxjs';

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { HeaderNavbarComponent } from "../header-navbar/header-navbar.component";
import { ApiService } from '../../services/api.service';
import { NavigateService } from '../../services/navigate.service';
import { ILocation } from '../../interfaces/ILocation';
import { ILocations } from '../../interfaces/ILocations';
import { FooterComponent } from '../footer/footer.component';
import { ButtonLoadMoreComponent } from '../button-load-more/button-load-more.component';

@Component({
  selector: 'app-locations-page',
  imports: [
    HeaderNavbarComponent,
    FormsModule,
    NgOptimizedImage,
    NgForOf,
    FooterComponent,
    ButtonLoadMoreComponent,
    ReactiveFormsModule
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
  public displayedLocations: ILocation[] = [];

  public visibleCount: number = 8;
  public showLoadMore: boolean = false;
  public nameFilterControl = new FormControl('');
  public typeFilter: string = '';
  public dimensionFilter: string = '';

  public ngOnInit(): void {
    this.loadLocations();
    this.setupNameFilter();
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
      this.updateDisplayedCharacters();
    })
  }

  public applyFilters(): void {
    const nameFilter = this.nameFilterControl.value || '';

    this.filteredLocations = this.locations.filter(location => {
      const matchesName = !nameFilter ||
        location.name.toLowerCase().includes(nameFilter.toLowerCase());

      const matchesType = !this.typeFilter ||
        location.type.toLowerCase() === this.typeFilter.toLowerCase();

      const matchesDimension = !this.dimensionFilter ||
        location.dimension.toLowerCase() === this.dimensionFilter.toLowerCase();

      return matchesName && matchesType && matchesDimension;
    });

    this.visibleCount = 12;
    this.updateDisplayedCharacters();
  }

  public onLoadMore(): void {
    this.visibleCount = this.filteredLocations.length;
    this.updateDisplayedCharacters();
  }

  private updateDisplayedCharacters(): void {
    this.displayedLocations = this.filteredLocations.slice(0, this.visibleCount);
    this.showLoadMore = this.filteredLocations.length > this.visibleCount;
    this._cdr.markForCheck();
  }

  private setupNameFilter(): void {
    this.nameFilterControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }
}
