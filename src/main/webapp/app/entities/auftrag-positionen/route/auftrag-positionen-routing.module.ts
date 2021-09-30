import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuftragPositionenComponent } from '../list/auftrag-positionen.component';
import { AuftragPositionenDetailComponent } from '../detail/auftrag-positionen-detail.component';
import { AuftragPositionenUpdateComponent } from '../update/auftrag-positionen-update.component';
import { AuftragPositionenRoutingResolveService } from './auftrag-positionen-routing-resolve.service';

const auftragPositionenRoute: Routes = [
  {
    path: '',
    component: AuftragPositionenComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuftragPositionenDetailComponent,
    resolve: {
      auftragPositionen: AuftragPositionenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuftragPositionenUpdateComponent,
    resolve: {
      auftragPositionen: AuftragPositionenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuftragPositionenUpdateComponent,
    resolve: {
      auftragPositionen: AuftragPositionenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(auftragPositionenRoute)],
  exports: [RouterModule],
})
export class AuftragPositionenRoutingModule {}
