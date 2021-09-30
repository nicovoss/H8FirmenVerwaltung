import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RohstoffComponent } from './list/rohstoff.component';
import { RohstoffDetailComponent } from './detail/rohstoff-detail.component';
import { RohstoffUpdateComponent } from './update/rohstoff-update.component';
import { RohstoffDeleteDialogComponent } from './delete/rohstoff-delete-dialog.component';
import { RohstoffRoutingModule } from './route/rohstoff-routing.module';

@NgModule({
  imports: [SharedModule, RohstoffRoutingModule],
  declarations: [RohstoffComponent, RohstoffDetailComponent, RohstoffUpdateComponent, RohstoffDeleteDialogComponent],
  entryComponents: [RohstoffDeleteDialogComponent],
})
export class RohstoffModule {}
