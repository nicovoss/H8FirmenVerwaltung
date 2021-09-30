import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArtikelZuBauteilmengeComponent } from '../list/artikel-zu-bauteilmenge.component';
import { ArtikelZuBauteilmengeDetailComponent } from '../detail/artikel-zu-bauteilmenge-detail.component';
import { ArtikelZuBauteilmengeUpdateComponent } from '../update/artikel-zu-bauteilmenge-update.component';
import { ArtikelZuBauteilmengeRoutingResolveService } from './artikel-zu-bauteilmenge-routing-resolve.service';

const artikelZuBauteilmengeRoute: Routes = [
  {
    path: '',
    component: ArtikelZuBauteilmengeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArtikelZuBauteilmengeDetailComponent,
    resolve: {
      artikelZuBauteilmenge: ArtikelZuBauteilmengeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArtikelZuBauteilmengeUpdateComponent,
    resolve: {
      artikelZuBauteilmenge: ArtikelZuBauteilmengeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArtikelZuBauteilmengeUpdateComponent,
    resolve: {
      artikelZuBauteilmenge: ArtikelZuBauteilmengeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(artikelZuBauteilmengeRoute)],
  exports: [RouterModule],
})
export class ArtikelZuBauteilmengeRoutingModule {}
