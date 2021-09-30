import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuftragComponent } from './list/auftrag.component';
import { AuftragDetailComponent } from './detail/auftrag-detail.component';
import { AuftragUpdateComponent } from './update/auftrag-update.component';
import { AuftragDeleteDialogComponent } from './delete/auftrag-delete-dialog.component';
import { AuftragRoutingModule } from './route/auftrag-routing.module';

@NgModule({
  imports: [SharedModule, AuftragRoutingModule],
  declarations: [AuftragComponent, AuftragDetailComponent, AuftragUpdateComponent, AuftragDeleteDialogComponent],
  entryComponents: [AuftragDeleteDialogComponent],
})
export class AuftragModule {}
