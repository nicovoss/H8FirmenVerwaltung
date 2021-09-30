import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBauteilGruppe } from '../bauteil-gruppe.model';
import { BauteilGruppeService } from '../service/bauteil-gruppe.service';

@Component({
  templateUrl: './bauteil-gruppe-delete-dialog.component.html',
})
export class BauteilGruppeDeleteDialogComponent {
  bauteilGruppe?: IBauteilGruppe;

  constructor(protected bauteilGruppeService: BauteilGruppeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bauteilGruppeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
