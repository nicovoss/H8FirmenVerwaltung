import { IRechnungKopf } from 'app/entities/rechnung-kopf/rechnung-kopf.model';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';
import { IOrganistation } from 'app/entities/organistation/organistation.model';

export interface IPatner {
  id?: number;
  vname?: string | null;
  name?: string | null;
  rechnungKopfs?: IRechnungKopf[] | null;
  auftrags?: IAuftrag[] | null;
  organistation?: IOrganistation | null;
}

export class Patner implements IPatner {
  constructor(
    public id?: number,
    public vname?: string | null,
    public name?: string | null,
    public rechnungKopfs?: IRechnungKopf[] | null,
    public auftrags?: IAuftrag[] | null,
    public organistation?: IOrganistation | null
  ) {}
}

export function getPatnerIdentifier(patner: IPatner): number | undefined {
  return patner.id;
}
