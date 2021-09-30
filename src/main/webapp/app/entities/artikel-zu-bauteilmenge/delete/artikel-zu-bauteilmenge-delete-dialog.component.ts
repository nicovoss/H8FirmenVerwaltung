import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';
import { ArtikelZuBauteilmengeService } from '../service/artikel-zu-bauteilmenge.service';

@Component({
  templateUrl: './artikel-zu-bauteilmenge-delete-dialog.component.html',
})
export class ArtikelZuBauteilmengeDeleteDialogComponent {
  artikelZuBauteilmenge?: IArtikelZuBauteilmenge;

  constructor(protected artikelZuBauteilmengeService: ArtikelZuBauteilmengeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.artikelZuBauteilmengeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
