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
  ICharacter
} from '../../interfaces/ICharacter';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { HeaderNavbarComponent } from '../header-navbar/header-navbar.component';
import { ApiService } from '../../services/api.service';
import { NavigateService } from '../../services/navigate.service';
import { ICharacters } from '../../interfaces/ICharacters';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-chars-page',
  imports: [
    HeaderNavbarComponent,
    NgOptimizedImage,
    NgForOf,
    FormsModule,
    FooterComponent
  ],
  templateUrl: './chars-page.component.html',
  styleUrl: './chars-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CharsPageComponent implements OnInit, OnDestroy {
  public characters: ICharacter[] = [];
  public filteredCharacters: ICharacter[] = [];

  public nameFilter: string = '';
  public speciesFilter: string = '';
  public genderFilter: string = '';
  public statusFilter: string = '';

  protected readonly _navigateService = inject(NavigateService);

  private readonly _apiService: ApiService = inject(ApiService);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.loadCharacters();
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
        this._cdr.markForCheck();
    })
  }

  public applyFilters(): void {
    this.filteredCharacters = this.characters.filter(character => {
      const matchesName = !this.nameFilter ||
        character.name.toLowerCase().includes(this.nameFilter.toLowerCase());

      const matchesSpecies = !this.speciesFilter ||
        character.species.toLowerCase() === this.speciesFilter.toLowerCase();

      const matchesGender = !this.genderFilter ||
        character.gender.toLowerCase() === this.genderFilter.toLowerCase();

      const matchesStatus = !this.statusFilter ||
        character.status.toLowerCase() === this.statusFilter.toLowerCase();

      return matchesName && matchesSpecies && matchesGender && matchesStatus;
    });

    this._cdr.markForCheck();
  }
}
