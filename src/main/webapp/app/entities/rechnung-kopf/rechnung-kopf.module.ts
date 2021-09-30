import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RechnungKopfComponent } from './list/rechnung-kopf.component';
import { RechnungKopfDetailComponent } from './detail/rechnung-kopf-detail.component';
import { RechnungKopfUpdateComponent } from './update/rechnung-kopf-update.component';
import { RechnungKopfDeleteDialogComponent } from './delete/rechnung-kopf-delete-dialog.component';
import { RechnungKopfRoutingModule } from './route/rechnung-kopf-routing.module';

@NgModule({
  imports: [SharedModule, RechnungKopfRoutingModule],
  declarations: [RechnungKopfComponent, RechnungKopfDetailComponent, RechnungKopfUpdateComponent, RechnungKopfDeleteDialogComponent],
  entryComponents: [RechnungKopfDeleteDialogComponent],
})
export class RechnungKopfModule {}
