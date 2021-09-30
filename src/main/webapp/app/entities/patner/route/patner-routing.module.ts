import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PatnerComponent } from '../list/patner.component';
import { PatnerDetailComponent } from '../detail/patner-detail.component';
import { PatnerUpdateComponent } from '../update/patner-update.component';
import { PatnerRoutingResolveService } from './patner-routing-resolve.service';

const patnerRoute: Routes = [
  {
    path: '',
    component: PatnerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PatnerDetailComponent,
    resolve: {
      patner: PatnerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PatnerUpdateComponent,
    resolve: {
      patner: PatnerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PatnerUpdateComponent,
    resolve: {
      patner: PatnerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(patnerRoute)],
  exports: [RouterModule],
})
export class PatnerRoutingModule {}
