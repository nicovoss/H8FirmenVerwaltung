import { IBauteil } from 'app/entities/bauteil/bauteil.model';
import { IArtikel } from 'app/entities/artikel/artikel.model';

export interface IArtikelZuBauteilmenge {
  id?: number;
  menge?: number | null;
  bauteil?: IBauteil | null;
  artikel?: IArtikel | null;
}

export class ArtikelZuBauteilmenge implements IArtikelZuBauteilmenge {
  constructor(public id?: number, public menge?: number | null, public bauteil?: IBauteil | null, public artikel?: IArtikel | null) {}
}

export function getArtikelZuBauteilmengeIdentifier(artikelZuBauteilmenge: IArtikelZuBauteilmenge): number | undefined {
  return artikelZuBauteilmenge.id;
}
