import { IRechnungKopf } from 'app/entities/rechnung-kopf/rechnung-kopf.model';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';

export interface IBediener {
  id?: number;
  vname?: string | null;
  name?: string | null;
  rechnungKopfs?: IRechnungKopf[] | null;
  auftrags?: IAuftrag[] | null;
}

export class Bediener implements IBediener {
  constructor(
    public id?: number,
    public vname?: string | null,
    public name?: string | null,
    public rechnungKopfs?: IRechnungKopf[] | null,
    public auftrags?: IAuftrag[] | null
  ) {}
}

export function getBedienerIdentifier(bediener: IBediener): number | undefined {
  return bediener.id;
}
