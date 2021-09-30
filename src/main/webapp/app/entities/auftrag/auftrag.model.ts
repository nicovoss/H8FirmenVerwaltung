import * as dayjs from 'dayjs';
import { IRechnungKopf } from 'app/entities/rechnung-kopf/rechnung-kopf.model';
import { IAuftragPositionen } from 'app/entities/auftrag-positionen/auftrag-positionen.model';
import { IStatus } from 'app/entities/status/status.model';
import { IPatner } from 'app/entities/patner/patner.model';
import { IBediener } from 'app/entities/bediener/bediener.model';

export interface IAuftrag {
  id?: number;
  erfasstAm?: dayjs.Dayjs | null;
  faelligAm?: dayjs.Dayjs | null;
  bezahl?: boolean | null;
  bezahltAm?: dayjs.Dayjs | null;
  abgeschlossenAm?: dayjs.Dayjs | null;
  kommentar?: string | null;
  rechnungKopfs?: IRechnungKopf[] | null;
  auftragPositionens?: IAuftragPositionen[] | null;
  status?: IStatus | null;
  kunde?: IPatner | null;
  bediener?: IBediener | null;
}

export class Auftrag implements IAuftrag {
  constructor(
    public id?: number,
    public erfasstAm?: dayjs.Dayjs | null,
    public faelligAm?: dayjs.Dayjs | null,
    public bezahl?: boolean | null,
    public bezahltAm?: dayjs.Dayjs | null,
    public abgeschlossenAm?: dayjs.Dayjs | null,
    public kommentar?: string | null,
    public rechnungKopfs?: IRechnungKopf[] | null,
    public auftragPositionens?: IAuftragPositionen[] | null,
    public status?: IStatus | null,
    public kunde?: IPatner | null,
    public bediener?: IBediener | null
  ) {
    this.bezahl = this.bezahl ?? false;
  }
}

export function getAuftragIdentifier(auftrag: IAuftrag): number | undefined {
  return auftrag.id;
}
