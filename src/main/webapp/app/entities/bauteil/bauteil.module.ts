import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BauteilComponent } from './list/bauteil.component';
import { BauteilDetailComponent } from './detail/bauteil-detail.component';
import { BauteilUpdateComponent } from './update/bauteil-update.component';
import { BauteilDeleteDialogComponent } from './delete/bauteil-delete-dialog.component';
import { BauteilRoutingModule } from './route/bauteil-routing.module';

@NgModule({
  imports: [SharedModule, BauteilRoutingModule],
  declarations: [BauteilComponent, BauteilDetailComponent, BauteilUpdateComponent, BauteilDeleteDialogComponent],
  entryComponents: [BauteilDeleteDialogComponent],
})
export class BauteilModule {}
