import { IBauteil } from 'app/entities/bauteil/bauteil.model';
import { IArtikelTyp } from 'app/entities/artikel-typ/artikel-typ.model';

export interface IBauteilGruppe {
  id?: number;
  name?: string | null;
  bauteils?: IBauteil[] | null;
  artikelTyp?: IArtikelTyp | null;
}

export class BauteilGruppe implements IBauteilGruppe {
  constructor(
    public id?: number,
    public name?: string | null,
    public bauteils?: IBauteil[] | null,
    public artikelTyp?: IArtikelTyp | null
  ) {}
}

export function getBauteilGruppeIdentifier(bauteilGruppe: IBauteilGruppe): number | undefined {
  return bauteilGruppe.id;
}
