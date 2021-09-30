import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuftragComponent } from '../list/auftrag.component';
import { AuftragDetailComponent } from '../detail/auftrag-detail.component';
import { AuftragUpdateComponent } from '../update/auftrag-update.component';
import { AuftragRoutingResolveService } from './auftrag-routing-resolve.service';

const auftragRoute: Routes = [
  {
    path: '',
    component: AuftragComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuftragDetailComponent,
    resolve: {
      auftrag: AuftragRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuftragUpdateComponent,
    resolve: {
      auftrag: AuftragRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuftragUpdateComponent,
    resolve: {
      auftrag: AuftragRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(auftragRoute)],
  exports: [RouterModule],
})
export class AuftragRoutingModule {}
