import { IPatner } from 'app/entities/patner/patner.model';

export interface IOrganistation {
  id?: number;
  orgaId?: number;
  name?: string | null;
  patners?: IPatner[] | null;
}

export class Organistation implements IOrganistation {
  constructor(public id?: number, public orgaId?: number, public name?: string | null, public patners?: IPatner[] | null) {}
}

export function getOrganistationIdentifier(organistation: IOrganistation): number | undefined {
  return organistation.id;
}
