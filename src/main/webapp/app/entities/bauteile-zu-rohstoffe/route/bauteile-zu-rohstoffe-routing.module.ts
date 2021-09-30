import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BauteileZuRohstoffeComponent } from '../list/bauteile-zu-rohstoffe.component';
import { BauteileZuRohstoffeDetailComponent } from '../detail/bauteile-zu-rohstoffe-detail.component';
import { BauteileZuRohstoffeUpdateComponent } from '../update/bauteile-zu-rohstoffe-update.component';
import { BauteileZuRohstoffeRoutingResolveService } from './bauteile-zu-rohstoffe-routing-resolve.service';

const bauteileZuRohstoffeRoute: Routes = [
  {
    path: '',
    component: BauteileZuRohstoffeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BauteileZuRohstoffeDetailComponent,
    resolve: {
      bauteileZuRohstoffe: BauteileZuRohstoffeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BauteileZuRohstoffeUpdateComponent,
    resolve: {
      bauteileZuRohstoffe: BauteileZuRohstoffeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BauteileZuRohstoffeUpdateComponent,
    resolve: {
      bauteileZuRohstoffe: BauteileZuRohstoffeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bauteileZuRohstoffeRoute)],
  exports: [RouterModule],
})
export class BauteileZuRohstoffeRoutingModule {}
