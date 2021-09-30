import { IRechnungKopf } from 'app/entities/rechnung-kopf/rechnung-kopf.model';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';

export interface IStatus {
  id?: number;
  statusBez?: string;
  rechnungKopfs?: IRechnungKopf[] | null;
  auftrags?: IAuftrag[] | null;
}

export class Status implements IStatus {
  constructor(
    public id?: number,
    public statusBez?: string,
    public rechnungKopfs?: IRechnungKopf[] | null,
    public auftrags?: IAuftrag[] | null
  ) {}
}

export function getStatusIdentifier(status: IStatus): number | undefined {
  return status.id;
}
