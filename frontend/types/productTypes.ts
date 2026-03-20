export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  code?: string;
  material?: string;
}

export interface Watch extends BaseProduct {
  waterResistance?: string;
  movement?: string;
  waterproof?: string;
  battery?: string;
}

export interface Pen extends BaseProduct {}

export interface Compass extends BaseProduct {
  movement?: string;
}

export interface Inkwell extends BaseProduct {}

export interface Products {
  watches: Watch[];
  'watches/luxury': Watch[];
  'watches/smartwatches': Watch[];
  'watches/pocket': Watch[];
  quillPens: Pen[];
  fountainPens: Pen[];
  compasses: Compass[];
  inkwells: Inkwell[];
}
