import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BauteilGruppeComponent } from '../list/bauteil-gruppe.component';
import { BauteilGruppeDetailComponent } from '../detail/bauteil-gruppe-detail.component';
import { BauteilGruppeUpdateComponent } from '../update/bauteil-gruppe-update.component';
import { BauteilGruppeRoutingResolveService } from './bauteil-gruppe-routing-resolve.service';

const bauteilGruppeRoute: Routes = [
  {
    path: '',
    component: BauteilGruppeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BauteilGruppeDetailComponent,
    resolve: {
      bauteilGruppe: BauteilGruppeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BauteilGruppeUpdateComponent,
    resolve: {
      bauteilGruppe: BauteilGruppeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BauteilGruppeUpdateComponent,
    resolve: {
      bauteilGruppe: BauteilGruppeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bauteilGruppeRoute)],
  exports: [RouterModule],
})
export class BauteilGruppeRoutingModule {}
