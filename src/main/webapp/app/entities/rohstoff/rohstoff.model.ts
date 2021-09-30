import { IBauteileZuRohstoffe } from 'app/entities/bauteile-zu-rohstoffe/bauteile-zu-rohstoffe.model';

export interface IRohstoff {
  id?: number;
  name?: string | null;
  preis?: number | null;
  bauteileZuRohstoffes?: IBauteileZuRohstoffe[] | null;
}

export class Rohstoff implements IRohstoff {
  constructor(
    public id?: number,
    public name?: string | null,
    public preis?: number | null,
    public bauteileZuRohstoffes?: IBauteileZuRohstoffe[] | null
  ) {}
}

export function getRohstoffIdentifier(rohstoff: IRohstoff): number | undefined {
  return rohstoff.id;
}
