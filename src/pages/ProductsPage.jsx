import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, getBrands } from '../api/productsApi';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/ui/Loading';

const SORTS = [
  { value: 'newest',     label: 'Plus récents' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'name_asc',   label: 'Nom A-Z' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filters = {
    search:    searchParams.get('search') || '',
    category:  searchParams.get('category') || '',
    brand:     searchParams.get('brand') || '',
    sort:      searchParams.get('sort') || 'newest',
    promo:     searchParams.get('promo') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  };

  const setFilter = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value; else delete params[key];
    delete params.page;
    setSearchParams(params);
    setCurrentPage(1);
  };

  const clearFilters = () => { setSearchParams({}); setCurrentPage(1); };
  const activeCount = [filters.category, filters.brand, filters.promo, filters.min_price, filters.max_price].filter(Boolean).length;

  useEffect(() => {
    Promise.all([getCategories(), getBrands()]).then(([c, b]) => { setCategories(c.data); setBrands(b.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ ...filters, page: currentPage, per_page: 12 })
      .then(res => { setProducts(res.data.products); setTotal(res.data.total); setLastPage(res.data.last_page); })
      .finally(() => setLoading(false));
  }, [searchParams, currentPage]);

  return (
    <div className="page-wrap" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="section-eyebrow">{total} résultat{total !== 1 ? 's' : ''}</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--text-primary)', margin: 0 }}>
            {filters.search ? `"${filters.search}"` : 'Tous les produits'}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)}
            className="input-lux" style={{ width: 'auto', padding: '8px 14px' }}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={() => setSidebarOpen(v => !v)} className="btn-ghost-sm" style={{ gap: 6 }}>
            <i className="bx bx-filter-alt" />
            Filtres
            {activeCount > 0 && (
              <span style={{ background: 'var(--bordeaux)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside style={{ width: 240, flexShrink: 0 }}>
            <div className="card-lux" style={{ padding: 20, position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <p style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', margin: 0 }}>Filtres</p>
                {activeCount > 0 && (
                  <button onClick={clearFilters}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--bordeaux)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="bx bx-x" /> Effacer
                  </button>
                )}
              </div>

              {/* Promo */}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--bd-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={!!filters.promo} onChange={e => setFilter('promo', e.target.checked ? '1' : '')}
                    style={{ accentColor: 'var(--bordeaux)', width: 14, height: 14 }} />
                  <span style={{ fontWeight: 500 }}>Promotions uniquement</span>
                </label>
              </div>

              {/* Categories */}
              <FilterBlock label="Catégorie" onClear={filters.category ? () => setFilter('category', '') : null}>
                {categories.map(cat => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '3px 0' }}>
                    <input type="radio" name="cat" checked={filters.category === String(cat.id)} onChange={() => setFilter('category', String(cat.id))}
                      style={{ accentColor: 'var(--bordeaux)', width: 13, height: 13 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{cat.nom}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{cat.products_count}</span>
                  </label>
                ))}
              </FilterBlock>

              {/* Brands */}
              <FilterBlock label="Marque" onClear={filters.brand ? () => setFilter('brand', '') : null}>
                {brands.map(brand => (
                  <label key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '3px 0' }}>
                    <input type="radio" name="brand" checked={filters.brand === String(brand.id)} onChange={() => setFilter('brand', String(brand.id))}
                      style={{ accentColor: 'var(--bordeaux)', width: 13, height: 13 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{brand.nom}</span>
                  </label>
                ))}
              </FilterBlock>

              {/* Price */}
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 10px' }}>Prix (MAD)</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" placeholder="Min" value={filters.min_price} onChange={e => setFilter('min_price', e.target.value)}
                    className="input-lux" style={{ padding: '7px 10px', fontSize: 12 }} />
                  <input type="number" placeholder="Max" value={filters.max_price} onChange={e => setFilter('max_price', e.target.value)}
                    className="input-lux" style={{ padding: '7px 10px', fontSize: 12 }} />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Grid */}
        <div style={{ flex: 1 }}>
          {loading ? <Loading /> : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <i className="bx bx-search-alt" style={{ fontSize: 56, color: 'var(--text-tertiary)', display: 'block', marginBottom: 12 }} />
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 12 }}>Aucun produit trouvé</p>
              <button onClick={clearFilters} className="btn-ghost-sm">Effacer les filtres</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {lastPage > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 32 }}>
                  {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'btn-primary' : 'btn-ghost-sm'}
                      style={{ padding: '7px 13px', minWidth: 36 }}>
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ label, children, onClear }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--bd-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: 0 }}>
          {label}
        </p>
        {onClear && (
          <button onClick={onClear} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--bordeaux)' }}>
            Effacer
          </button>
        )}
      </div>
      <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </div>
    </div>
  );
}
