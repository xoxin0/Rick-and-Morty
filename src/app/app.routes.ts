import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full'},
  {
    path: 'characters',
    loadComponent: () =>
      import('./components/chars-page/chars-page.component').then(
        (m) => m.CharsPageComponent
      )
  },
  {
    path: 'character/:id',
    loadComponent: () =>
      import('./components/char-details-page/char-details-page.component').then(
        (m) => m.CharDetailsPageComponent
      )
  },
  {
    path: 'locations',
    loadComponent: () =>
      import('./components/locations-page/locations-page.component').then(
        (m) => m.LocationsPageComponent
      )
  },
  {
    path: 'location/:id',
    loadComponent: () =>
      import('./components/location-details/location-details.component').then(
        (m) => m.LocationDetailsComponent
      )
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./components/episodes-page/episodes-page.component').then(
        (m) => m.EpisodesPageComponent
      )
  },
  {
    path: 'episode/:id',
    loadComponent: () =>
      import('./components/episode-details/episode-details.component').then(
        (m) => m.EpisodeDetailsComponent
      )
  },
  { path: '**', redirectTo: 'characters', pathMatch: 'full'}
];
