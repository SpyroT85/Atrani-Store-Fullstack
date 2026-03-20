import { useState, useEffect } from 'react';
import ConfirmModal from './components/ConfirmModal';
import Modal from './components/Modal';
import ProductForm from './components/ProductForm';
import { useProducts } from './hooks/useProducts';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatsCards from './components/StatsCards';
import ProductsTable from './components/ProductsTable';
import type { Product } from './types/product';

const API_URL = 'http://localhost:5000';

export default function App() {
  const { products, loading, error, deleteProduct, setProducts } = useProducts();
  const [dark, setDark] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ id: number; name: string } | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const handleDeleteRequest = (id: number, name: string) => setConfirmModal({ id, name });

  const handleConfirmDelete = async () => {
    if (!confirmModal) return;
    await deleteProduct(confirmModal.id, confirmModal.name);
    setConfirmModal(null);
  };

  const handleAdd = async (data: Partial<Product>) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]);
      setAddOpen(false);
    } catch {
      alert('Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data: Partial<Product>) => {
    if (!editProduct) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditProduct(null);
    } catch {
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-zinc-500">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-[Inter]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Topbar dark={dark} onToggleDark={() => setDark(!dark)} />
        <StatsCards products={products} />
        <ProductsTable
          products={products}
          onDelete={handleDeleteRequest}
          onEdit={setEditProduct}
          onAdd={() => setAddOpen(true)}
        />

        {confirmModal && (
          <ConfirmModal
            message={`Are you sure you want to delete "${confirmModal.name}"?`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setConfirmModal(null)}
          />
        )}

        {addOpen && (
          <Modal title="Add product" onClose={() => setAddOpen(false)}>
            <ProductForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} loading={saving} />
          </Modal>
        )}

        {editProduct && (
          <Modal title="Edit product" onClose={() => setEditProduct(null)}>
            <ProductForm initial={editProduct} onSubmit={handleEdit} onCancel={() => setEditProduct(null)} loading={saving} />
          </Modal>
        )}
      </div>
    </div>
  );
}