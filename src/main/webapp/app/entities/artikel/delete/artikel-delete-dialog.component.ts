import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArtikel } from '../artikel.model';
import { ArtikelService } from '../service/artikel.service';

@Component({
  templateUrl: './artikel-delete-dialog.component.html',
})
export class ArtikelDeleteDialogComponent {
  artikel?: IArtikel;

  constructor(protected artikelService: ArtikelService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.artikelService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
