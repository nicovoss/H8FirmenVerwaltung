import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArtikelTypComponent } from '../list/artikel-typ.component';
import { ArtikelTypDetailComponent } from '../detail/artikel-typ-detail.component';
import { ArtikelTypUpdateComponent } from '../update/artikel-typ-update.component';
import { ArtikelTypRoutingResolveService } from './artikel-typ-routing-resolve.service';

const artikelTypRoute: Routes = [
  {
    path: '',
    component: ArtikelTypComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArtikelTypDetailComponent,
    resolve: {
      artikelTyp: ArtikelTypRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArtikelTypUpdateComponent,
    resolve: {
      artikelTyp: ArtikelTypRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArtikelTypUpdateComponent,
    resolve: {
      artikelTyp: ArtikelTypRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(artikelTypRoute)],
  exports: [RouterModule],
})
export class ArtikelTypRoutingModule {}
