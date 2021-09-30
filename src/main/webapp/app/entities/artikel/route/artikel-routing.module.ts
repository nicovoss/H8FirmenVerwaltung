import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArtikelComponent } from '../list/artikel.component';
import { ArtikelDetailComponent } from '../detail/artikel-detail.component';
import { ArtikelUpdateComponent } from '../update/artikel-update.component';
import { ArtikelRoutingResolveService } from './artikel-routing-resolve.service';

const artikelRoute: Routes = [
  {
    path: '',
    component: ArtikelComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArtikelDetailComponent,
    resolve: {
      artikel: ArtikelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArtikelUpdateComponent,
    resolve: {
      artikel: ArtikelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArtikelUpdateComponent,
    resolve: {
      artikel: ArtikelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(artikelRoute)],
  exports: [RouterModule],
})
export class ArtikelRoutingModule {}
