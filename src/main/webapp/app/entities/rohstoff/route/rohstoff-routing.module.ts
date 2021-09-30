import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RohstoffComponent } from '../list/rohstoff.component';
import { RohstoffDetailComponent } from '../detail/rohstoff-detail.component';
import { RohstoffUpdateComponent } from '../update/rohstoff-update.component';
import { RohstoffRoutingResolveService } from './rohstoff-routing-resolve.service';

const rohstoffRoute: Routes = [
  {
    path: '',
    component: RohstoffComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RohstoffDetailComponent,
    resolve: {
      rohstoff: RohstoffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RohstoffUpdateComponent,
    resolve: {
      rohstoff: RohstoffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RohstoffUpdateComponent,
    resolve: {
      rohstoff: RohstoffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rohstoffRoute)],
  exports: [RouterModule],
})
export class RohstoffRoutingModule {}
