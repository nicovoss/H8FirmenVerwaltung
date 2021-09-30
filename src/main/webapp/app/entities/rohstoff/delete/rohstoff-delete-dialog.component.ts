import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRohstoff } from '../rohstoff.model';
import { RohstoffService } from '../service/rohstoff.service';

@Component({
  templateUrl: './rohstoff-delete-dialog.component.html',
})
export class RohstoffDeleteDialogComponent {
  rohstoff?: IRohstoff;

  constructor(protected rohstoffService: RohstoffService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rohstoffService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
