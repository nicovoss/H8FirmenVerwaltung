import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganistationComponent } from '../list/organistation.component';
import { OrganistationDetailComponent } from '../detail/organistation-detail.component';
import { OrganistationUpdateComponent } from '../update/organistation-update.component';
import { OrganistationRoutingResolveService } from './organistation-routing-resolve.service';

const organistationRoute: Routes = [
  {
    path: '',
    component: OrganistationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganistationDetailComponent,
    resolve: {
      organistation: OrganistationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganistationUpdateComponent,
    resolve: {
      organistation: OrganistationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganistationUpdateComponent,
    resolve: {
      organistation: OrganistationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organistationRoute)],
  exports: [RouterModule],
})
export class OrganistationRoutingModule {}
