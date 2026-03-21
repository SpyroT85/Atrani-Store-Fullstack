import type { Watch, Pen, Compass, Inkwell } from '@/types/productTypes';

const API_URL = 'http://localhost:5000';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any) {
  return {
    id: p.slug || p.id.toString(),
    name: p.name,
    description: p.description,
    image: p.image_url,
    price: parseFloat(p.price),
    code: p.code ?? undefined,
    material: p.material ?? undefined,
    waterResistance: p.water_resistance ?? undefined,
    battery: p.battery ?? undefined,
    movement: p.movement ?? undefined,
    waterproof: p.waterproof ?? undefined,
  };
}

export async function fetchWatches(): Promise<Watch[]> {
  const res = await fetch(`${API_URL}/api/products?category=watches`);
  if (!res.ok) throw new Error('Failed to fetch watches');
  return (await res.json()).map(mapProduct);
}

export async function fetchLuxury(): Promise<Watch[]> {
  const res = await fetch(`${API_URL}/api/products?category=watches/luxury`);
  if (!res.ok) throw new Error('Failed to fetch luxury watches');
  return (await res.json()).map(mapProduct);
}

export async function fetchSmartWatches(): Promise<Watch[]> {
  const res = await fetch(`${API_URL}/api/products?category=watches/smartwatches`);
  if (!res.ok) throw new Error('Failed to fetch smartwatches');
  return (await res.json()).map(mapProduct);
}

export async function fetchPocketWatches(): Promise<Watch[]> {
  const res = await fetch(`${API_URL}/api/products?category=watches/pocket`);
  if (!res.ok) throw new Error('Failed to fetch pocket watches');
  return (await res.json()).map(mapProduct);
}

export async function fetchQuillPens(): Promise<Pen[]> {
  const res = await fetch(`${API_URL}/api/products?category=quillPens`);
  if (!res.ok) throw new Error('Failed to fetch quill pens');
  return (await res.json()).map(mapProduct);
}

export async function fetchFountainPens(): Promise<Pen[]> {
  const res = await fetch(`${API_URL}/api/products?category=fountainPens`);
  if (!res.ok) throw new Error('Failed to fetch fountain pens');
  return (await res.json()).map(mapProduct);
}

export async function fetchCompasses(): Promise<Compass[]> {
  const res = await fetch(`${API_URL}/api/products?category=compasses`);
  if (!res.ok) throw new Error('Failed to fetch compasses');
  return (await res.json()).map(mapProduct);
}

export async function fetchInkwells(): Promise<Inkwell[]> {
  const res = await fetch(`${API_URL}/api/products?category=inkwells`);
  if (!res.ok) throw new Error('Failed to fetch inkwells');
  return (await res.json()).map(mapProduct);
}

export async function fetchProductById(_category: string, id: string) {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const p = await res.json();
  return mapProduct(p);
}