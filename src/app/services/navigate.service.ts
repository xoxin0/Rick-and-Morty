import {
  inject,
  Injectable
} from '@angular/core';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class NavigateService {
  private _router = inject(Router);

  public navigateToCharacters(): void {
    this._router.navigate(['characters']);
  }

  public navigateToCharacterDetails(id: number): void {
    this._router.navigate([`character/${id}`]);
  }

  public navigateToLocations(): void {
    this._router.navigate(['locations']);
  }

  public navigateToEpisodes(): void {
    this._router.navigate(['episodes']);
  }

  public navigateToLocationDetails(id: number): void {
    this._router.navigate([`location/${id}`]);
  }

  public navigateToEpisodeDetails(id: number): void {
    this._router.navigate([`episode/${id}`]);
  }
}
