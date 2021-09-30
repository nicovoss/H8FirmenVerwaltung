import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BauteilGruppeComponent } from './list/bauteil-gruppe.component';
import { BauteilGruppeDetailComponent } from './detail/bauteil-gruppe-detail.component';
import { BauteilGruppeUpdateComponent } from './update/bauteil-gruppe-update.component';
import { BauteilGruppeDeleteDialogComponent } from './delete/bauteil-gruppe-delete-dialog.component';
import { BauteilGruppeRoutingModule } from './route/bauteil-gruppe-routing.module';

@NgModule({
  imports: [SharedModule, BauteilGruppeRoutingModule],
  declarations: [BauteilGruppeComponent, BauteilGruppeDetailComponent, BauteilGruppeUpdateComponent, BauteilGruppeDeleteDialogComponent],
  entryComponents: [BauteilGruppeDeleteDialogComponent],
})
export class BauteilGruppeModule {}
