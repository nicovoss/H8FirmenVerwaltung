import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PatnerComponent } from './list/patner.component';
import { PatnerDetailComponent } from './detail/patner-detail.component';
import { PatnerUpdateComponent } from './update/patner-update.component';
import { PatnerDeleteDialogComponent } from './delete/patner-delete-dialog.component';
import { PatnerRoutingModule } from './route/patner-routing.module';

@NgModule({
  imports: [SharedModule, PatnerRoutingModule],
  declarations: [PatnerComponent, PatnerDetailComponent, PatnerUpdateComponent, PatnerDeleteDialogComponent],
  entryComponents: [PatnerDeleteDialogComponent],
})
export class PatnerModule {}
