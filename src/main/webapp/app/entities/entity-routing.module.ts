import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'rechnung-kopf',
        data: { pageTitle: 'h8FirmenVerwaltungApp.rechnungKopf.home.title' },
        loadChildren: () => import('./rechnung-kopf/rechnung-kopf.module').then(m => m.RechnungKopfModule),
      },
      {
        path: 'rechnung-positionen',
        data: { pageTitle: 'h8FirmenVerwaltungApp.rechnungPositionen.home.title' },
        loadChildren: () => import('./rechnung-positionen/rechnung-positionen.module').then(m => m.RechnungPositionenModule),
      },
      {
        path: 'artikel',
        data: { pageTitle: 'h8FirmenVerwaltungApp.artikel.home.title' },
        loadChildren: () => import('./artikel/artikel.module').then(m => m.ArtikelModule),
      },
      {
        path: 'artikel-typ',
        data: { pageTitle: 'h8FirmenVerwaltungApp.artikelTyp.home.title' },
        loadChildren: () => import('./artikel-typ/artikel-typ.module').then(m => m.ArtikelTypModule),
      },
      {
        path: 'status',
        data: { pageTitle: 'h8FirmenVerwaltungApp.status.home.title' },
        loadChildren: () => import('./status/status.module').then(m => m.StatusModule),
      },
      {
        path: 'auftrag',
        data: { pageTitle: 'h8FirmenVerwaltungApp.auftrag.home.title' },
        loadChildren: () => import('./auftrag/auftrag.module').then(m => m.AuftragModule),
      },
      {
        path: 'auftrag-positionen',
        data: { pageTitle: 'h8FirmenVerwaltungApp.auftragPositionen.home.title' },
        loadChildren: () => import('./auftrag-positionen/auftrag-positionen.module').then(m => m.AuftragPositionenModule),
      },
      {
        path: 'patner',
        data: { pageTitle: 'h8FirmenVerwaltungApp.patner.home.title' },
        loadChildren: () => import('./patner/patner.module').then(m => m.PatnerModule),
      },
      {
        path: 'bediener',
        data: { pageTitle: 'h8FirmenVerwaltungApp.bediener.home.title' },
        loadChildren: () => import('./bediener/bediener.module').then(m => m.BedienerModule),
      },
      {
        path: 'organistation',
        data: { pageTitle: 'h8FirmenVerwaltungApp.organistation.home.title' },
        loadChildren: () => import('./organistation/organistation.module').then(m => m.OrganistationModule),
      },
      {
        path: 'rohstoff',
        data: { pageTitle: 'h8FirmenVerwaltungApp.rohstoff.home.title' },
        loadChildren: () => import('./rohstoff/rohstoff.module').then(m => m.RohstoffModule),
      },
      {
        path: 'bauteil',
        data: { pageTitle: 'h8FirmenVerwaltungApp.bauteil.home.title' },
        loadChildren: () => import('./bauteil/bauteil.module').then(m => m.BauteilModule),
      },
      {
        path: 'bauteil-gruppe',
        data: { pageTitle: 'h8FirmenVerwaltungApp.bauteilGruppe.home.title' },
        loadChildren: () => import('./bauteil-gruppe/bauteil-gruppe.module').then(m => m.BauteilGruppeModule),
      },
      {
        path: 'bauteile-zu-rohstoffe',
        data: { pageTitle: 'h8FirmenVerwaltungApp.bauteileZuRohstoffe.home.title' },
        loadChildren: () => import('./bauteile-zu-rohstoffe/bauteile-zu-rohstoffe.module').then(m => m.BauteileZuRohstoffeModule),
      },
      {
        path: 'artikel-zu-bauteilmenge',
        data: { pageTitle: 'h8FirmenVerwaltungApp.artikelZuBauteilmenge.home.title' },
        loadChildren: () => import('./artikel-zu-bauteilmenge/artikel-zu-bauteilmenge.module').then(m => m.ArtikelZuBauteilmengeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
