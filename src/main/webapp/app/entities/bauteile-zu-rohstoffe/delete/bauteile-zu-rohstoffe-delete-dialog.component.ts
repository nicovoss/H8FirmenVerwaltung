import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';
import { BauteileZuRohstoffeService } from '../service/bauteile-zu-rohstoffe.service';

@Component({
  templateUrl: './bauteile-zu-rohstoffe-delete-dialog.component.html',
})
export class BauteileZuRohstoffeDeleteDialogComponent {
  bauteileZuRohstoffe?: IBauteileZuRohstoffe;

  constructor(protected bauteileZuRohstoffeService: BauteileZuRohstoffeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bauteileZuRohstoffeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
