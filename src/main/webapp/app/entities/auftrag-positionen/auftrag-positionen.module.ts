import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuftragPositionenComponent } from './list/auftrag-positionen.component';
import { AuftragPositionenDetailComponent } from './detail/auftrag-positionen-detail.component';
import { AuftragPositionenUpdateComponent } from './update/auftrag-positionen-update.component';
import { AuftragPositionenDeleteDialogComponent } from './delete/auftrag-positionen-delete-dialog.component';
import { AuftragPositionenRoutingModule } from './route/auftrag-positionen-routing.module';

@NgModule({
  imports: [SharedModule, AuftragPositionenRoutingModule],
  declarations: [
    AuftragPositionenComponent,
    AuftragPositionenDetailComponent,
    AuftragPositionenUpdateComponent,
    AuftragPositionenDeleteDialogComponent,
  ],
  entryComponents: [AuftragPositionenDeleteDialogComponent],
})
export class AuftragPositionenModule {}
