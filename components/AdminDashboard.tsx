
import React, { useState, useMemo } from 'react';
import { Product, CategoryItem } from '../types';
import { db } from '../lib/firebase';
// Use firebase/compat/app to access FieldValue and other namespace properties
import firebase from 'firebase/compat/app';
import { convertDriveLink } from '../utils/drive';

interface AdminDashboardProps {
  products: Product[];
  categories: CategoryItem[];
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, categories, onLogout }) => {
  const [adminSearch, setAdminSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '10'
  });

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
      p.category.toLowerCase().includes(adminSearch.toLowerCase())
    );
  }, [products, adminSearch]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      category: formData.category || (categories[0]?.name || 'Uncategorized'),
      description: formData.description,
      image: formData.image,
      stock: parseInt(formData.stock) || 0,
      // Fixed: Using compat FieldValue for server timestamp
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      if (editingId) {
        // Fixed: Using compat update method
        await db.collection('products').doc(editingId).update(payload);
      } else {
        // Fixed: Using compat add method
        payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('products').add(payload);
      }
      resetForm();
    } catch (err: any) {
      console.error("Firebase Error:", err);
      alert(`Error: ${err.message || 'Failed to save product.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      // Fixed: Using compat add method
      await db.collection('categories').add({ name: newCategoryName.trim() });
      setNewCategoryName('');
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Delete this category?')) {
      try {
        // Fixed: Using compat delete method
        await db.collection('categories').doc(id).delete();
      } catch (err) {
        console.error("Failed to delete category", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '10' });
    setEditingId(null);
    setIsFormOpen(false);
    setLoading(false);
  };

  const editProduct = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      description: p.description,
      image: p.image,
      stock: p.stock.toString()
    });
    setIsFormOpen(true);
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      try {
        // Fixed: Using compat delete method
        await db.collection('products').doc(id).delete();
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black font-montserrat text-gray-900 tracking-tight">Inventory Control</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 font-medium text-sm">Managing <span className="text-blue-600 font-bold">{products.length}</span> live products</p>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setIsCategoryManagerOpen(true)} className="px-6 py-4 rounded-2xl border border-gray-200 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2 bg-white">
            <i className="fas fa-tags"></i> Categories
          </button>
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Search products..." className="pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-sm w-48 lg:w-64" value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} />
          </div>
          <button onClick={() => { resetForm(); setIsFormOpen(true); }} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl">
            <i className="fas fa-plus"></i> New Product
          </button>
        </div>
      </div>

      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
            <button onClick={() => setIsCategoryManagerOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <i className="fas fa-times text-xl"></i>
            </button>
            <h2 className="text-2xl font-black font-montserrat mb-6">Manage Categories</h2>
            <div className="flex gap-2 mb-8">
              <input className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={newCategoryName} placeholder="Category name..." onChange={(e) => setNewCategoryName(e.target.value)} />
              <button onClick={handleAddCategory} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700">Add</button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700 uppercase tracking-widest text-xs">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><i className="fas fa-trash-alt"></i></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black font-montserrat tracking-tight">{editingId ? 'Modify Product' : 'Register New Product'}</h2>
              <button onClick={resetForm} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleProductSubmit} className="flex-grow overflow-y-auto p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Product Title</label>
                    <input required className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg" value={formData.name} placeholder="e.g. Ultra Slim LED Monitor" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Retail Price (₹)</label>
                      <input required type="number" className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-black text-xl text-blue-600" value={formData.price} placeholder="0" onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Collection / Category</label>
                      <select required className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm uppercase tracking-widest" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 flex justify-between items-center">Google Drive Link</label>
                    <input className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" value={formData.image} placeholder="https://drive.google.com/..." onChange={(e) => setFormData({...formData, image: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Description</label>
                    <textarea required rows={5} className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="lg:col-span-5">
                   <div className="bg-gray-50 rounded-[2rem] aspect-square overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                      {formData.image ? <img src={convertDriveLink(formData.image)} className="w-full h-full object-cover rounded-[2rem]" /> : <i className="fas fa-image text-5xl text-gray-200"></i>}
                   </div>
                </div>
              </div>
              <div className="flex gap-6 mt-16 pb-10">
                <button type="button" onClick={resetForm} className="flex-1 py-6 bg-gray-100 text-gray-600 font-black text-xs rounded-[1.5rem]">Discard</button>
                <button type="submit" disabled={loading} className="flex-[2] py-6 bg-blue-600 text-white font-black text-xs rounded-[1.5rem] shadow-2xl">
                  {loading ? 'Processing...' : (editingId ? 'Save Updates' : 'Publish Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400">Identity</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400">Class</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400">Value</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/10 transition-colors group">
                  <td className="px-10 py-8 flex items-center gap-6">
                    <img src={convertDriveLink(p.image)} className="w-16 h-16 rounded-2xl object-cover" />
                    <span className="font-black text-gray-900 font-montserrat">{p.name}</span>
                  </td>
                  <td className="px-10 py-8"><span className="px-4 py-2 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-500">{p.category}</span></td>
                  <td className="px-10 py-8 font-black text-gray-900">₹{p.price.toLocaleString()}</td>
                  <td className="px-10 py-8 text-right space-x-2">
                    <button onClick={() => editProduct(p)} className="p-4 bg-white border border-gray-100 rounded-xl hover:text-blue-600"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-4 bg-white border border-gray-100 rounded-xl hover:text-red-500"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
