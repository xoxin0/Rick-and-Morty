import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  NgForOf, NgIf,
  NgOptimizedImage
} from '@angular/common';

import {
  ICharacter
} from '../../interfaces/ICharacter';

import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { HeaderNavbarComponent } from '../header-navbar/header-navbar.component';
import { ApiService } from '../../services/api.service';
import { NavigateService } from '../../services/navigate.service';
import { ICharacters } from '../../interfaces/ICharacters';
import { FooterComponent } from '../footer/footer.component';
import { ButtonLoadMoreComponent } from '../button-load-more/button-load-more.component';

@Component({
  selector: 'app-chars-page',
  imports: [
    HeaderNavbarComponent,
    NgOptimizedImage,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
    ButtonLoadMoreComponent
  ],
  templateUrl: './chars-page.component.html',
  styleUrl: './chars-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CharsPageComponent implements OnInit, OnDestroy {
  public characters: ICharacter[] = [];
  public filteredCharacters: ICharacter[] = [];
  public displayedCharacters: ICharacter[] = [];

  public visibleCount: number = 8;
  public showLoadMore: boolean = false;
  public nameFilterControl = new FormControl('');
  public speciesFilter: string = '';
  public genderFilter: string = '';
  public statusFilter: string = '';

  protected readonly _navigateService = inject(NavigateService);

  private readonly _apiService: ApiService = inject(ApiService);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.loadCharacters();
    this.setupNameFilter();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public loadCharacters(): void {
    this._apiService.getAllCharacters()
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe((characters: ICharacters) => {
        this.characters = characters.results;
        this.filteredCharacters = this.characters;
        this.updateDisplayedCharacters();
    })
  }

  public applyFilters(): void {
    const nameFilter = this.nameFilterControl.value || '';

    this.filteredCharacters = this.characters.filter(character => {
      const matchesName = !nameFilter ||
        character.name.toLowerCase().includes(nameFilter.toLowerCase());

      const matchesSpecies = !this.speciesFilter ||
        character.species.toLowerCase() === this.speciesFilter.toLowerCase();

      const matchesGender = !this.genderFilter ||
        character.gender.toLowerCase() === this.genderFilter.toLowerCase();

      const matchesStatus = !this.statusFilter ||
        character.status.toLowerCase() === this.statusFilter.toLowerCase();

      return matchesName && matchesSpecies && matchesGender && matchesStatus;
    });

    this.visibleCount = 8;
    this.updateDisplayedCharacters();
  }

  public onLoadMore(): void {
    this.visibleCount = this.filteredCharacters.length;
    this.updateDisplayedCharacters();
  }

  private updateDisplayedCharacters(): void {
    this.displayedCharacters = this.filteredCharacters.slice(0, this.visibleCount);
    this.showLoadMore = this.filteredCharacters.length > this.visibleCount;
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
