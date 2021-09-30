import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RechnungPositionenComponent } from './list/rechnung-positionen.component';
import { RechnungPositionenDetailComponent } from './detail/rechnung-positionen-detail.component';
import { RechnungPositionenUpdateComponent } from './update/rechnung-positionen-update.component';
import { RechnungPositionenDeleteDialogComponent } from './delete/rechnung-positionen-delete-dialog.component';
import { RechnungPositionenRoutingModule } from './route/rechnung-positionen-routing.module';

@NgModule({
  imports: [SharedModule, RechnungPositionenRoutingModule],
  declarations: [
    RechnungPositionenComponent,
    RechnungPositionenDetailComponent,
    RechnungPositionenUpdateComponent,
    RechnungPositionenDeleteDialogComponent,
  ],
  entryComponents: [RechnungPositionenDeleteDialogComponent],
})
export class RechnungPositionenModule {}
