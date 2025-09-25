import {
  Component,
  inject
} from '@angular/core';

import { NavigateService } from '../../services/navigate.service';

@Component({
  selector: 'app-button-go-back',
  imports: [],
  templateUrl: './button-go-back.component.html',
  styleUrl: './button-go-back.component.scss'
})

export class ButtonGoBackComponent {
  protected readonly _navigateService: NavigateService = inject(NavigateService);
}
