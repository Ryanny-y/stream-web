import React, { useEffect, useMemo, useState } from 'react';
import { Archive, ChevronLeft, ChevronRight, EyeOff, FolderPlus, Plus, RefreshCw, Tags } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { StatsCard } from '../users/components/StatsCard';
import { apiFetch } from '@/shared/lib/api';
import { FilterBar } from './components/FilterBar';
import { CategoryTable } from './components/CategoryTable';
import { CategoryFormModal } from './components/CategoryFormModal';
import { CategoryDetailsModal } from './components/CategoryDetailsModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import type {
  AdminCategory,
  CategoryFormData,
  CategorySort,
  CategoryStats,
  CategoryStatus,
  CategoryStatusFilter,
} from './types';

const ITEMS_PER_PAGE = 8;

const calculateStats = (categories: AdminCategory[]): CategoryStats => ({
  totalCategories: categories.length,
  activeCategories: categories.filter((category) => category.status === 'ACTIVE').length,
  hiddenCategories: categories.filter((category) => category.status === 'HIDDEN').length,
  videosCategorized: categories.reduce((total, category) => total + (category.videoCount || 0), 0),
});

export const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CategoryStatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<CategorySort>('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const stats = useMemo(() => calculateStats(categories), [categories]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/admin/categories');
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return categories
      .filter((category) => category.categoryName.toLowerCase().includes(normalizedSearch))
      .filter((category) => statusFilter === 'ALL' || category.status === statusFilter)
      .sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'MOST_VIDEOS') return b.videoCount - a.videoCount;
        return a.categoryName.localeCompare(b.categoryName);
      });
  }, [categories, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  const upsertCategory = (category: AdminCategory) => {
    setCategories((current) => {
      const exists = current.some((item) => item.categoryId === category.categoryId);
      return exists
        ? current.map((item) => item.categoryId === category.categoryId ? category : item)
        : [category, ...current];
    });
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleView = (category: AdminCategory) => {
    setSelectedCategory(category);
    setIsDetailsOpen(true);
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: AdminCategory) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const savedCategory = editingCategory
        ? await apiFetch(`/admin/categories/${editingCategory.categoryId}`, { method: 'PUT', body: data })
        : await apiFetch('/admin/categories', { method: 'POST', body: data });

      upsertCategory(savedCategory);
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (category: AdminCategory, status: CategoryStatus) => {
    setError(null);
    try {
      const updatedCategory = await apiFetch(`/admin/categories/${category.categoryId}`, {
        method: 'PUT',
        body: { status },
      });
      upsertCategory(updatedCategory);
    } catch (err: any) {
      setError(err.message || 'Failed to update category status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await apiFetch(`/admin/categories/${selectedCategory.categoryId}`, { method: 'DELETE' });
      setCategories((current) => current.filter((category) => category.categoryId !== selectedCategory.categoryId));
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
          <p className="text-gray-400 mt-1">Manage video genres and organize platform content.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchCategories}
            disabled={isLoading}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Total Categories" value={isLoading ? '...' : stats.totalCategories} icon={Tags} />
        <StatsCard label="Active Categories" value={isLoading ? '...' : stats.activeCategories} icon={FolderPlus} />
        <StatsCard label="Hidden Categories" value={isLoading ? '...' : stats.hiddenCategories} icon={EyeOff} />
        <StatsCard label="Videos Categorized" value={isLoading ? '...' : stats.videosCategorized} icon={Archive} />
      </div>

      <div className="space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onSortChange={setSortBy}
        />

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-500">
            <p className="text-sm font-medium">{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchCategories} className="ml-auto hover:bg-rose-500/20">
              Try Again
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-12 text-center">
            <Tags className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No categories found</h3>
            <p className="text-gray-500 mt-1">Create a category or adjust your filters.</p>
            <Button onClick={handleAdd} variant="outline" className="mt-4 border-white/10 text-white">
              Add Category
            </Button>
          </div>
        ) : (
          <>
            <CategoryTable
              categories={currentCategories}
              onView={handleView}
              onEdit={handleEdit}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteClick}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
              <p className="text-sm text-gray-500">
                Showing <span className="text-white font-medium">{startIndex + 1}</span> to{' '}
                <span className="text-white font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredCategories.length)}</span> of{' '}
                <span className="text-white font-medium">{filteredCategories.length}</span> categories
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="px-3 text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        existingNames={categories.map((category) => category.categoryName)}
        isSubmitting={isSubmitting}
      />

      <CategoryDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        category={selectedCategory}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        categoryName={selectedCategory?.categoryName || ''}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CategoryManagementPage;
