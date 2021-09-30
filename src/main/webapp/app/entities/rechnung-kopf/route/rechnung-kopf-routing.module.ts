import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RechnungKopfComponent } from '../list/rechnung-kopf.component';
import { RechnungKopfDetailComponent } from '../detail/rechnung-kopf-detail.component';
import { RechnungKopfUpdateComponent } from '../update/rechnung-kopf-update.component';
import { RechnungKopfRoutingResolveService } from './rechnung-kopf-routing-resolve.service';

const rechnungKopfRoute: Routes = [
  {
    path: '',
    component: RechnungKopfComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RechnungKopfDetailComponent,
    resolve: {
      rechnungKopf: RechnungKopfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RechnungKopfUpdateComponent,
    resolve: {
      rechnungKopf: RechnungKopfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RechnungKopfUpdateComponent,
    resolve: {
      rechnungKopf: RechnungKopfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rechnungKopfRoute)],
  exports: [RouterModule],
})
export class RechnungKopfRoutingModule {}
