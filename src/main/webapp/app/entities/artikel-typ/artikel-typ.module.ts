import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ArtikelTypComponent } from './list/artikel-typ.component';
import { ArtikelTypDetailComponent } from './detail/artikel-typ-detail.component';
import { ArtikelTypUpdateComponent } from './update/artikel-typ-update.component';
import { ArtikelTypDeleteDialogComponent } from './delete/artikel-typ-delete-dialog.component';
import { ArtikelTypRoutingModule } from './route/artikel-typ-routing.module';

@NgModule({
  imports: [SharedModule, ArtikelTypRoutingModule],
  declarations: [ArtikelTypComponent, ArtikelTypDetailComponent, ArtikelTypUpdateComponent, ArtikelTypDeleteDialogComponent],
  entryComponents: [ArtikelTypDeleteDialogComponent],
})
export class ArtikelTypModule {}
