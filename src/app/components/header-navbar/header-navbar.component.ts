import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  NgClass,
  NgOptimizedImage
} from '@angular/common';

import {
  Router,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';
import { NavigateService } from '../../services/navigate.service';

@Component({
  selector: 'app-header-navbar',
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './header-navbar.component.html',
  styleUrl: './header-navbar.component.scss'
})

export class HeaderNavbarComponent implements OnInit {
  public activeButton: string = 'characters';

  protected _navigateService = inject(NavigateService);

  private _router = inject(Router);

  public ngOnInit(): void {
    this.setActiveButtonFromRoute(this._router.url);

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
      this.setActiveButtonFromRoute(event.urlAfterRedirects);
    });
  }

  private setActiveButtonFromRoute(url: string): void {
    if (url.includes('/characters') || url.includes('/character')) {
      this.activeButton = 'characters';
    } else if (url.includes('/locations') || url.includes('/location')) {
      this.activeButton = 'locations';
    } else if (url.includes('/episodes') || url.includes('/episode')) {
      this.activeButton = 'episodes';
    }
  }
}
