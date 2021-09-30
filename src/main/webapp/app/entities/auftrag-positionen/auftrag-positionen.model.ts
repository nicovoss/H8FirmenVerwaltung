import { IAuftrag } from 'app/entities/auftrag/auftrag.model';
import { IArtikel } from 'app/entities/artikel/artikel.model';

export interface IAuftragPositionen {
  id?: number;
  menge?: number | null;
  auftrag?: IAuftrag | null;
  artikel?: IArtikel | null;
}

export class AuftragPositionen implements IAuftragPositionen {
  constructor(public id?: number, public menge?: number | null, public auftrag?: IAuftrag | null, public artikel?: IArtikel | null) {}
}

export function getAuftragPositionenIdentifier(auftragPositionen: IAuftragPositionen): number | undefined {
  return auftragPositionen.id;
}
