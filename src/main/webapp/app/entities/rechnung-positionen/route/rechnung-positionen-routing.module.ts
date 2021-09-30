import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RechnungPositionenComponent } from '../list/rechnung-positionen.component';
import { RechnungPositionenDetailComponent } from '../detail/rechnung-positionen-detail.component';
import { RechnungPositionenUpdateComponent } from '../update/rechnung-positionen-update.component';
import { RechnungPositionenRoutingResolveService } from './rechnung-positionen-routing-resolve.service';

const rechnungPositionenRoute: Routes = [
  {
    path: '',
    component: RechnungPositionenComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RechnungPositionenDetailComponent,
    resolve: {
      rechnungPositionen: RechnungPositionenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RechnungPositionenUpdateComponent,
    resolve: {
      rechnungPositionen: RechnungPositionenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RechnungPositionenUpdateComponent,
    resolve: {
      rechnungPositionen: RechnungPositionenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rechnungPositionenRoute)],
  exports: [RouterModule],
})
export class RechnungPositionenRoutingModule {}
