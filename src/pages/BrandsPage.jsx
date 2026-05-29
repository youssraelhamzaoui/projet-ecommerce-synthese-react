import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBrands } from '../api/productsApi';
import Loading from '../components/ui/Loading';

const PLACEHOLDER = 'https://placehold.co/200x100/f3f4f6/9ca3af?text=Brand';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands().then(res => setBrands(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Nos marques</h1>
      <p className="text-gray-500 mb-8">Découvrez nos marques partenaires et leurs gammes de produits</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {brands.map((brand) => (
          <Link key={brand.id} to={`/produits?brand=${brand.id}`}
            className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:border-red-200 transition group">
            {brand.logo ? (
              <img src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`}
                alt={brand.nom} className="h-16 object-contain mx-auto mb-3 grayscale group-hover:grayscale-0 transition"
                onError={(e) => { e.target.src = PLACEHOLDER; }} />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-gray-400">{brand.nom[0]}</span>
              </div>
            )}
            <p className="font-semibold text-gray-700 text-sm">{brand.nom}</p>
            <p className="text-xs text-gray-400 mt-0.5">{brand.products_count} produits</p>
            {brand.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{brand.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
