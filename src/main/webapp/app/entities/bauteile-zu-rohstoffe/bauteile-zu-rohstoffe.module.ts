import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BauteileZuRohstoffeComponent } from './list/bauteile-zu-rohstoffe.component';
import { BauteileZuRohstoffeDetailComponent } from './detail/bauteile-zu-rohstoffe-detail.component';
import { BauteileZuRohstoffeUpdateComponent } from './update/bauteile-zu-rohstoffe-update.component';
import { BauteileZuRohstoffeDeleteDialogComponent } from './delete/bauteile-zu-rohstoffe-delete-dialog.component';
import { BauteileZuRohstoffeRoutingModule } from './route/bauteile-zu-rohstoffe-routing.module';

@NgModule({
  imports: [SharedModule, BauteileZuRohstoffeRoutingModule],
  declarations: [
    BauteileZuRohstoffeComponent,
    BauteileZuRohstoffeDetailComponent,
    BauteileZuRohstoffeUpdateComponent,
    BauteileZuRohstoffeDeleteDialogComponent,
  ],
  entryComponents: [BauteileZuRohstoffeDeleteDialogComponent],
})
export class BauteileZuRohstoffeModule {}
