import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/productsApi';
import Loading from '../components/ui/Loading';

const PLACEHOLDER = 'https://placehold.co/400x200/f3f4f6/9ca3af?text=Catégorie';
const COLORS = ['from-red-500 to-rose-600','from-blue-500 to-indigo-600','from-green-500 to-emerald-600',
  'from-orange-500 to-amber-600','from-purple-500 to-violet-600','from-teal-500 to-cyan-600'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Nos catégories</h1>
      <p className="text-gray-500 mb-8">Parcourez notre catalogue par instrument ou famille musicale</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
            {cat.image ? (
              <img src={cat.image.startsWith('http') ? cat.image : `/storage/${cat.image}`}
                alt={cat.nom} className="w-full h-40 object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }} />
            ) : (
              <div className={`h-40 bg-gradient-to-br ${COLORS[idx % COLORS.length]} flex items-center justify-center`}>
                <span className="text-5xl">🎵</span>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">{cat.nom}</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {cat.products_count} produits
                </span>
              </div>

              {cat.sub_categories?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.sub_categories.slice(0, 4).map(sub => (
                    <Link key={sub.id} to={`/produits?subcategory=${sub.id}`}
                      className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full hover:bg-red-100 transition">
                      {sub.nom}
                    </Link>
                  ))}
                  {cat.sub_categories.length > 4 && (
                    <span className="text-xs text-gray-400">+{cat.sub_categories.length - 4}</span>
                  )}
                </div>
              )}

              <Link to={`/produits?category=${cat.id}`}
                className="block w-full text-center bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition">
                Voir les produits
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
