import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganistationComponent } from './list/organistation.component';
import { OrganistationDetailComponent } from './detail/organistation-detail.component';
import { OrganistationUpdateComponent } from './update/organistation-update.component';
import { OrganistationDeleteDialogComponent } from './delete/organistation-delete-dialog.component';
import { OrganistationRoutingModule } from './route/organistation-routing.module';

@NgModule({
  imports: [SharedModule, OrganistationRoutingModule],
  declarations: [OrganistationComponent, OrganistationDetailComponent, OrganistationUpdateComponent, OrganistationDeleteDialogComponent],
  entryComponents: [OrganistationDeleteDialogComponent],
})
export class OrganistationModule {}
