import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArtikelTyp } from '../artikel-typ.model';
import { ArtikelTypService } from '../service/artikel-typ.service';

@Component({
  templateUrl: './artikel-typ-delete-dialog.component.html',
})
export class ArtikelTypDeleteDialogComponent {
  artikelTyp?: IArtikelTyp;

  constructor(protected artikelTypService: ArtikelTypService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.artikelTypService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
