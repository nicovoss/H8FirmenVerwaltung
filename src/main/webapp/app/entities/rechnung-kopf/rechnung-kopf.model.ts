import { IRechnungPositionen } from 'app/entities/rechnung-positionen/rechnung-positionen.model';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';
import { IBediener } from 'app/entities/bediener/bediener.model';
import { IPatner } from 'app/entities/patner/patner.model';
import { IStatus } from 'app/entities/status/status.model';

export interface IRechnungKopf {
  id?: number;
  rechnungPositionens?: IRechnungPositionen[] | null;
  auftrag?: IAuftrag | null;
  bediner?: IBediener | null;
  kunde?: IPatner | null;
  status?: IStatus | null;
}

export class RechnungKopf implements IRechnungKopf {
  constructor(
    public id?: number,
    public rechnungPositionens?: IRechnungPositionen[] | null,
    public auftrag?: IAuftrag | null,
    public bediner?: IBediener | null,
    public kunde?: IPatner | null,
    public status?: IStatus | null
  ) {}
}

export function getRechnungKopfIdentifier(rechnungKopf: IRechnungKopf): number | undefined {
  return rechnungKopf.id;
}
