import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BedienerComponent } from '../list/bediener.component';
import { BedienerDetailComponent } from '../detail/bediener-detail.component';
import { BedienerUpdateComponent } from '../update/bediener-update.component';
import { BedienerRoutingResolveService } from './bediener-routing-resolve.service';

const bedienerRoute: Routes = [
  {
    path: '',
    component: BedienerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BedienerDetailComponent,
    resolve: {
      bediener: BedienerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BedienerUpdateComponent,
    resolve: {
      bediener: BedienerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BedienerUpdateComponent,
    resolve: {
      bediener: BedienerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bedienerRoute)],
  exports: [RouterModule],
})
export class BedienerRoutingModule {}
