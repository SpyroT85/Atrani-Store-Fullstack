import { ImSpinner8 } from 'react-icons/im';
import { useState, useMemo, useCallback } from 'react';
import ConfirmModal from './components/ConfirmModal';
import Modal from './components/Modal';
import ProductForm from './components/ProductForm';
import Accounts from './components/Accounts';
import { useAuth } from './context/AuthContext';
import { useProductsContext } from './context/ProductsContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatsCards from './components/StatsCards';
import ProductsTable from './components/ProductsTable';
import type { Product } from './types/product';
import ProtectedRoute from './components/ProtectedRoute';
import AcceptInvite from './pages/AcceptInvite';
import { Routes, Route } from 'react-router-dom';
;

const API_URL = 'http://localhost:5000';

export default function App() {
  const { products, loading, error, deleteProduct, setProducts } = useProductsContext();
  const { admin } = useAuth();
  const isDemo = !admin || (admin.role !== 'admin' && admin.role !== 'superadmin');
  const [currentPage, setCurrentPage] = useState('products');

  const [confirmModal, setConfirmModal] = useState<{ id: number; name: string } | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDeleteRequest = useCallback((id: number, name: string) => {
    setConfirmModal({ id, name });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmModal) return;
    await deleteProduct(confirmModal.id, confirmModal.name);
    setConfirmModal(null);
  }, [confirmModal, deleteProduct]);

  const handleAdd = useCallback(async (data: Partial<Product>) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401) { alert('Unauthorized — please log in again'); return; }
      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]);
      setAddOpen(false);
    } catch {
      alert('Failed to add product');
    } finally {
      setSaving(false);
    }
  }, [setProducts, admin]);

  const handleEdit = useCallback(async (data: Partial<Product>) => {
    if (!editProduct) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401) { alert('Unauthorized — please log in again'); return; }
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditProduct(null);
    } catch {
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  }, [editProduct, setProducts, admin]);

  const handleOpenAdd = useCallback(() => setAddOpen(true), []);
  const handleCategoryChange = useCallback((cat: string) => { setCategoryFilter(cat); setPage(1); }, []);
  const handleSearch = useCallback((s: string) => { setSearch(s); setPage(1); }, []);
  const handlePageSizeChange = useCallback((size: number) => { setPageSize(size); setPage(1); }, []);

  const filteredProducts = useMemo(() =>
    products
      .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
      .filter(p => {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.code ?? '').toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
        );
      }),
    [products, categoryFilter, search]
  );

  const paginatedProducts = useMemo(() =>
    filteredProducts.slice((page - 1) * pageSize, page * pageSize),
    [filteredProducts, page, pageSize]
  );

  const totalPages = useMemo(() =>
    Math.ceil(filteredProducts.length / pageSize),
    [filteredProducts.length, pageSize]
  );

  return (
    <Routes>
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-[Inter]">
            {error ? (
              <div className="flex items-center justify-center w-full min-h-screen text-red-500">{error}</div>
            ) : loading ? (
              <div className="flex items-center justify-center w-full min-h-screen">
                <ImSpinner8 className="spinner text-[#C8874A]" size={48} />
              </div>
            ) : (
              <>
                <Sidebar page={currentPage} onNavigate={setCurrentPage} />
                <div className="flex-1 p-8 overflow-auto">
                  <Topbar />

                  {currentPage === 'products' && (
                    <>
                      <StatsCards />
                      <ProductsTable
                        products={paginatedProducts}
                        onDelete={handleDeleteRequest}
                        onEdit={setEditProduct}
                        onAdd={handleOpenAdd}
                        categoryFilter={categoryFilter}
                        onCategoryChange={handleCategoryChange}
                        search={search}
                        onSearch={handleSearch}
                        page={page}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalProducts={filteredProducts.length}
                        onPageChange={setPage}
                        onPageSizeChange={handlePageSizeChange}
                        isDemo={isDemo}
                      />
                    </>
                  )}

                  {currentPage === 'accounts' && <Accounts />}

                  {currentPage === 'analytics' && (
                    <div className="flex items-center justify-center h-64 text-zinc-400">
                      Analytics page — coming soon
                    </div>
                  )}

                  {confirmModal && (
                    <ConfirmModal
                      message={`Are you sure you want to delete "${confirmModal.name}"?`}
                      onConfirm={handleConfirmDelete}
                      onCancel={() => setConfirmModal(null)}
                      isDemo={isDemo}
                    />
                  )}

                  {addOpen && (
                    <Modal title="Add product" onClose={() => setAddOpen(false)}>
                      <ProductForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} loading={saving} token={admin?.token} isDemo={isDemo} />
                    </Modal>
                  )}

                  {editProduct && (
                    <Modal title="Edit product" onClose={() => setEditProduct(null)}>
                      <ProductForm initial={editProduct} onSubmit={handleEdit} onCancel={() => setEditProduct(null)} loading={saving} token={admin?.token} isDemo={isDemo} />
                    </Modal>
                  )}
                </div>
              </>
            )}
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}