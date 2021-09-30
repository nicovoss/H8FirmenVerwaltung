import { IBauteil } from 'app/entities/bauteil/bauteil.model';
import { IRohstoff } from 'app/entities/rohstoff/rohstoff.model';

export interface IBauteileZuRohstoffe {
  id?: number;
  menge?: number | null;
  bauteil?: IBauteil | null;
  rohstoff?: IRohstoff | null;
}

export class BauteileZuRohstoffe implements IBauteileZuRohstoffe {
  constructor(public id?: number, public menge?: number | null, public bauteil?: IBauteil | null, public rohstoff?: IRohstoff | null) {}
}

export function getBauteileZuRohstoffeIdentifier(bauteileZuRohstoffe: IBauteileZuRohstoffe): number | undefined {
  return bauteileZuRohstoffe.id;
}
