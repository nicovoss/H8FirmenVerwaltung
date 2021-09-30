import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BedienerComponent } from './list/bediener.component';
import { BedienerDetailComponent } from './detail/bediener-detail.component';
import { BedienerUpdateComponent } from './update/bediener-update.component';
import { BedienerDeleteDialogComponent } from './delete/bediener-delete-dialog.component';
import { BedienerRoutingModule } from './route/bediener-routing.module';

@NgModule({
  imports: [SharedModule, BedienerRoutingModule],
  declarations: [BedienerComponent, BedienerDetailComponent, BedienerUpdateComponent, BedienerDeleteDialogComponent],
  entryComponents: [BedienerDeleteDialogComponent],
})
export class BedienerModule {}
