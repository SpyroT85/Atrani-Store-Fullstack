import type { Product } from '../types/product';

interface StatsCardsProps {
  products: Product[];
}

export default function StatsCards({ products }: StatsCardsProps) {
  const watches = products.filter(p => p.category.startsWith('watches'));
  const pens = products.filter(p => p.category.includes('Pens'));
  const other = products.filter(p => p.category === 'compasses' || p.category === 'inkwells');

  const stats = [
    { label: 'Total products', value: products.length, sub: 'all categories' },
    { label: 'Watches', value: watches.length, sub: '4 categories' },
    { label: 'Pens', value: pens.length, sub: '2 categories' },
    { label: 'Other', value: other.length, sub: 'compasses & inkwells' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-400 mb-1">{stat.label}</div>
          <div className="text-2xl font-medium">{stat.value}</div>
          <div className="text-xs text-[#C8874A] mt-1">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}