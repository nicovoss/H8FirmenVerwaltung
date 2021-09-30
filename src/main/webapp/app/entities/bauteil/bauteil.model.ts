import { IBauteileZuRohstoffe } from 'app/entities/bauteile-zu-rohstoffe/bauteile-zu-rohstoffe.model';
import { IArtikelZuBauteilmenge } from 'app/entities/artikel-zu-bauteilmenge/artikel-zu-bauteilmenge.model';
import { IBauteilGruppe } from 'app/entities/bauteil-gruppe/bauteil-gruppe.model';

export interface IBauteil {
  id?: number;
  name?: string | null;
  bauteileZuRohstoffes?: IBauteileZuRohstoffe[] | null;
  artikelZuBauteilmenges?: IArtikelZuBauteilmenge[] | null;
  bauteilgruppe?: IBauteilGruppe | null;
}

export class Bauteil implements IBauteil {
  constructor(
    public id?: number,
    public name?: string | null,
    public bauteileZuRohstoffes?: IBauteileZuRohstoffe[] | null,
    public artikelZuBauteilmenges?: IArtikelZuBauteilmenge[] | null,
    public bauteilgruppe?: IBauteilGruppe | null
  ) {}
}

export function getBauteilIdentifier(bauteil: IBauteil): number | undefined {
  return bauteil.id;
}
