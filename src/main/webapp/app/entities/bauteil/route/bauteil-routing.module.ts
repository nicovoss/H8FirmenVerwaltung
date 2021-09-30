import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BauteilComponent } from '../list/bauteil.component';
import { BauteilDetailComponent } from '../detail/bauteil-detail.component';
import { BauteilUpdateComponent } from '../update/bauteil-update.component';
import { BauteilRoutingResolveService } from './bauteil-routing-resolve.service';

const bauteilRoute: Routes = [
  {
    path: '',
    component: BauteilComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BauteilDetailComponent,
    resolve: {
      bauteil: BauteilRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BauteilUpdateComponent,
    resolve: {
      bauteil: BauteilRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BauteilUpdateComponent,
    resolve: {
      bauteil: BauteilRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bauteilRoute)],
  exports: [RouterModule],
})
export class BauteilRoutingModule {}
