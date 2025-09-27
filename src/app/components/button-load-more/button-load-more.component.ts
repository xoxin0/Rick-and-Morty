import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { NgIf } from "@angular/common";

@Component({
  selector: 'app-button-load-more',
    imports: [
      NgIf
    ],
  templateUrl: './button-load-more.component.html',
  styleUrl: './button-load-more.component.scss'
})

export class ButtonLoadMoreComponent {
  @Input() showLoadMore: boolean = false;
  @Output() loadMoreClick = new EventEmitter<void>();

  public loadMore(): void {
    this.loadMoreClick.emit();
  }
}
