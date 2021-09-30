import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ArtikelZuBauteilmengeComponent } from './list/artikel-zu-bauteilmenge.component';
import { ArtikelZuBauteilmengeDetailComponent } from './detail/artikel-zu-bauteilmenge-detail.component';
import { ArtikelZuBauteilmengeUpdateComponent } from './update/artikel-zu-bauteilmenge-update.component';
import { ArtikelZuBauteilmengeDeleteDialogComponent } from './delete/artikel-zu-bauteilmenge-delete-dialog.component';
import { ArtikelZuBauteilmengeRoutingModule } from './route/artikel-zu-bauteilmenge-routing.module';

@NgModule({
  imports: [SharedModule, ArtikelZuBauteilmengeRoutingModule],
  declarations: [
    ArtikelZuBauteilmengeComponent,
    ArtikelZuBauteilmengeDetailComponent,
    ArtikelZuBauteilmengeUpdateComponent,
    ArtikelZuBauteilmengeDeleteDialogComponent,
  ],
  entryComponents: [ArtikelZuBauteilmengeDeleteDialogComponent],
})
export class ArtikelZuBauteilmengeModule {}
