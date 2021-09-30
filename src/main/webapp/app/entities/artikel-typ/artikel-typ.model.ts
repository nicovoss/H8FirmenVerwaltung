import { IArtikel } from 'app/entities/artikel/artikel.model';
import { IBauteilGruppe } from 'app/entities/bauteil-gruppe/bauteil-gruppe.model';

export interface IArtikelTyp {
  id?: number;
  name?: string | null;
  artikels?: IArtikel[] | null;
  bauteilGruppes?: IBauteilGruppe[] | null;
}

export class ArtikelTyp implements IArtikelTyp {
  constructor(
    public id?: number,
    public name?: string | null,
    public artikels?: IArtikel[] | null,
    public bauteilGruppes?: IBauteilGruppe[] | null
  ) {}
}

export function getArtikelTypIdentifier(artikelTyp: IArtikelTyp): number | undefined {
  return artikelTyp.id;
}
