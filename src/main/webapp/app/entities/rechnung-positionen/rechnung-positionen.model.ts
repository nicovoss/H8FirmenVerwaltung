import { IRechnungKopf } from 'app/entities/rechnung-kopf/rechnung-kopf.model';
import { IArtikel } from 'app/entities/artikel/artikel.model';

export interface IRechnungPositionen {
  id?: number;
  artikelName?: string | null;
  artikelBeschreibung?: string | null;
  artikelPreis?: number | null;
  menge?: number;
  rechnungskopf?: IRechnungKopf | null;
  artikel?: IArtikel | null;
}

export class RechnungPositionen implements IRechnungPositionen {
  constructor(
    public id?: number,
    public artikelName?: string | null,
    public artikelBeschreibung?: string | null,
    public artikelPreis?: number | null,
    public menge?: number,
    public rechnungskopf?: IRechnungKopf | null,
    public artikel?: IArtikel | null
  ) {}
}

export function getRechnungPositionenIdentifier(rechnungPositionen: IRechnungPositionen): number | undefined {
  return rechnungPositionen.id;
}
