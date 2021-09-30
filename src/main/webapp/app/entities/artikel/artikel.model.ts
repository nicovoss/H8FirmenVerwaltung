import { IAuftragPositionen } from 'app/entities/auftrag-positionen/auftrag-positionen.model';
import { IRechnungPositionen } from 'app/entities/rechnung-positionen/rechnung-positionen.model';
import { IArtikelZuBauteilmenge } from 'app/entities/artikel-zu-bauteilmenge/artikel-zu-bauteilmenge.model';
import { IArtikelTyp } from 'app/entities/artikel-typ/artikel-typ.model';

export interface IArtikel {
  id?: number;
  name?: string | null;
  auftragPositionens?: IAuftragPositionen[] | null;
  rechnungPositionens?: IRechnungPositionen[] | null;
  artikelZuBauteilmenges?: IArtikelZuBauteilmenge[] | null;
  artikelTyp?: IArtikelTyp | null;
}

export class Artikel implements IArtikel {
  constructor(
    public id?: number,
    public name?: string | null,
    public auftragPositionens?: IAuftragPositionen[] | null,
    public rechnungPositionens?: IRechnungPositionen[] | null,
    public artikelZuBauteilmenges?: IArtikelZuBauteilmenge[] | null,
    public artikelTyp?: IArtikelTyp | null
  ) {}
}

export function getArtikelIdentifier(artikel: IArtikel): number | undefined {
  return artikel.id;
}
