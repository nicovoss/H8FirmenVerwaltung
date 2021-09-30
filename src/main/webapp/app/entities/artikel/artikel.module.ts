import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ArtikelComponent } from './list/artikel.component';
import { ArtikelDetailComponent } from './detail/artikel-detail.component';
import { ArtikelUpdateComponent } from './update/artikel-update.component';
import { ArtikelDeleteDialogComponent } from './delete/artikel-delete-dialog.component';
import { ArtikelRoutingModule } from './route/artikel-routing.module';

@NgModule({
  imports: [SharedModule, ArtikelRoutingModule],
  declarations: [ArtikelComponent, ArtikelDetailComponent, ArtikelUpdateComponent, ArtikelDeleteDialogComponent],
  entryComponents: [ArtikelDeleteDialogComponent],
})
export class ArtikelModule {}
