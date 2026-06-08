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

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1600&auto=format&fit=cover',
    title: "Guitares d'Exception",
    subtitle: "Une sélection rigoureuse d'instruments d'exception pour les passionnés."
  },
  {
    image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=1600&auto=format&fit=cover',
    title: 'Le Studio Moderne',
    subtitle: 'Équipez votre espace de création avec le meilleur matériel audio du marché.'
  },
  {
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1600&auto=format&fit=cover',
    title: 'Pianos & Claviers de Prestige',
    subtitle: 'Du toucher lourd classique aux synthétiseurs de pointe.'
  }
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
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. Zdna hna 'subcategory' bach nchedouha mel URL params
  const filters = {
    search:      searchParams.get('search') || '',
    category:    searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    brand:       searchParams.get('brand') || '',
    sort:        searchParams.get('sort') || 'newest',
    promo:       searchParams.get('promo') || '',
    min_price:   searchParams.get('min_price') || '',
    max_price:   searchParams.get('max_price') || '',
  };

  const setFilter = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value; else delete params[key];
    
    // Ila bddel l-category l-kbira, n-mshou subcategory dima automatic bach mayb9ash khlal f l-filtrage
    if (key === 'category') {
      delete params.subcategory;
    }

    delete params.page;
    setSearchParams(params);
    setCurrentPage(1);
  };

  // 2. Fonction jdida mkhsusa b l-filtrage dyal sous-catégories
  const handleSubCategoryChange = (subCatId) => {
    const params = Object.fromEntries(searchParams);
    if (params.subcategory === String(subCatId)) {
      delete params.subcategory; // Ila 3awd dghat 3liha kat-décocha
    } else {
      params.subcategory = String(subCatId);
    }
    delete params.page;
    setSearchParams(params);
    setCurrentPage(1);
  };

  const changePage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > lastPage) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const clearFilters = () => { 
    setSearchParams({}); 
    setCurrentPage(1); 
  };
  
  // Zdna hna filters.subcategory f x-count dyal les filtres actifs
  const activeCount = [filters.category, filters.subcategory, filters.brand, filters.promo, filters.min_price, filters.max_price].filter(Boolean).length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([c, b]) => { setCategories(c.data); setBrands(b.data); })
      .catch((err) => console.error("Erreur filtres alternative", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ ...filters, page: currentPage, per_page: 12 })
      .then(res => { 
        setProducts(res.data.products); 
        setTotal(res.data.total); 
        setLastPage(res.data.last_page); 
      })
      .catch((err) => console.error("Erreur produits", err))
      .finally(() => setLoading(false));
  }, [searchParams, currentPage]);

  return (
    <div style={{ backgroundColor: '#F2EFE9', minHeight: '100vh', paddingBottom: 60 }}>
      
      <style>{`
        :root {
          --rosegold: #b76e79;
          --txt-dark: #1a1a1a;
          --border-color: rgba(183, 110, 121, 0.18);
        }

        /* BARRE LATÉRALE RESPONSIVE */
        .sidebar-aside {
          width: 280px;
          flex-shrink: 0;
          transition: all 0.3s ease-in-out;
        }

        .sticky-sidebar {
          position: sticky;
          top: 90px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          background: white;
          border-radius: 14px;
          border: 1px solid var(--border-color);
          padding: 26px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.03);
          z-index: 90;
        }

        .sticky-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .sticky-sidebar::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 4px;
        }

        .overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
        }

        @media (max-width: 1024px) {
          .sidebar-aside {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            background: white;
            z-index: 999;
            width: 300px;
            overflow-y: auto;
            transform: translateX(-100%);
            padding: 20px;
            box-shadow: 5px 0 15px rgba(0,0,0,0.1);
          }
          .sidebar-aside.open {
            transform: translateX(0);
          }
          .sticky-sidebar {
            position: static;
            border: none;
            box-shadow: none;
            padding: 0;
            max-height: none;
          }
          .overlay.show {
            display: block;
          }
        }

        /* 3. Style dyal les sous-catégories list */
        .subcategories-list {
          margin-left: 22px;
          padding-left: 10px;
          border-left: 1px dashed var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
          margin-bottom: 8px;
        }
        .subcategory-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 0;
          font-size: 12.5px;
          color: #7a7570;
          transition: color 0.2s;
        }
        .subcategory-item:hover, .subcategory-item.active {
          color: var(--rosegold);
        }

        /* SLIDER & INPUTS */
        .hero-slider { position: relative; width: 100%; height: 450px; overflow: hidden; background: #0f0f0f; margin-bottom: 50px; }
        .slide-track { display: flex; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .slide-item { min-width: 100%; height: 100%; position: relative; }
        .slide-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.75; }
        .slide-content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 0 8%; color: #FFF; background: linear-gradient(to right, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1) 100%); }

        .input-lux-select {
          background: white;
          border: 1px solid var(--border-color);
          color: var(--txt-dark);
          border-radius: 6px;
          outline: none;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-radio { accent-color: var(--rosegold); cursor: pointer; width: 15px; height: 15px; }

        /* PAGINATION STYLES */
        .pagination-container { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 40px; }
        .pagination-btn { padding: 8px 14px; border: 1px solid var(--border-color); background: white; border-radius: 6px; font-size: 13px; font-weight: 500; color: var(--txt-dark); cursor: pointer; transition: all 0.2s; }
        .pagination-btn:hover:not(:disabled) { border-color: var(--rosegold); color: var(--rosegold); }
        .pagination-btn.active { background: var(--rosegold); color: white; border-color: var(--rosegold); }
        .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* Hero Slider */}
      <div className="hero-slider">
        <div className="slide-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {SLIDES.map((slide, idx) => (
            <div className="slide-item" key={idx}>
              <img src={slide.image} alt={slide.title} className="slide-img" />
              <div className="slide-content">
                <span style={{ color: 'var(--rosegold)', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '12px' }}>Exclusivité Store</span>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-1px', lineHeight: '1.1' }}>{slide.title}</h2>
                <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: '#eaeaea', maxWidth: '600px', lineHeight: '1.5' }}>{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Results */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 35, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: '#b76e79', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
              {total ?? 0} résultat{total !== 1 ? 's' : ''}
            </p>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--txt-dark)', margin: 0 }}>{filters.search ? `Résultats pour "${filters.search}"` : 'Tous les Instruments'}</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)} className="input-lux-select" style={{ padding: '10px 16px' }}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            
            <button onClick={() => setSidebarOpen(true)} style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--txt-dark)', fontWeight: 500 }}>
              <i className="bx bx-filter-alt" style={{ color: 'var(--rosegold)' }} />
              <span>Filtrage</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          
          <div className={`overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

          {/* BARRE LATÉRALE */}
          <aside className={`sidebar-aside ${sidebarOpen ? 'open' : ''}`}>
            <div className="sticky-sidebar">
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--txt-dark)', margin: 0 }}>FILTRES</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                   {activeCount > 0 && <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--rosegold)', fontWeight: 600 }}>Effacer</button>}
                   {sidebarOpen && <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1, color: 'var(--txt-dark)' }}>×</button>}
                </div>
              </div>

              {/* Promo */}
              <div style={{ marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
                  <input type="checkbox" checked={!!filters.promo} onChange={e => setFilter('promo', e.target.checked ? '1' : '')} style={{ accentColor: 'var(--rosegold)', width: 16, height: 16 }} />
                  <span style={{ fontWeight: 600 }}>En Promotion</span>
                </label>
              </div>

              {/* Categories + Subcategories Render */}
              <FilterBlock label="Catégories" onClear={filters.category ? () => setFilter('category', '') : null}>
                {categories.map(cat => {
                  const isCurrentCategorySelected = filters.category === String(cat.id);
                  
                  return (
                    <div key={cat.id}>
                      {/* Catégorie Principale */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 0' }}>
                        <input 
                          type="radio" 
                          className="filter-radio" 
                          checked={isCurrentCategorySelected} 
                          onChange={() => setFilter('category', String(cat.id))} 
                        />
                        <span style={{ fontSize: 13.5, color: isCurrentCategorySelected ? 'var(--rosegold)' : '#5a5550', flex: 1, fontWeight: isCurrentCategorySelected ? 600 : 400 }}>
                          {cat.nom}
                        </span>
                        <span style={{ fontSize: 11, opacity: 0.5 }}>{cat.products_count}</span>
                      </label>

                      {/* 4. Rendred dial les sous-catégories gha ila kant la catégorie séléctionnée ou 3ndha data */}
                      {isCurrentCategorySelected && cat.sub_categories && cat.sub_categories.length > 0 && (
                        <div className="subcategories-list">
                          {cat.sub_categories.map(subCat => {
                            const isSubActive = filters.subcategory === String(subCat.id);
                            return (
                              <label key={subCat.id} className={`subcategory-item ${isSubActive ? 'active' : ''}`}>
                                <input 
                                  type="checkbox" 
                                  checked={isSubActive}
                                  onChange={() => handleSubCategoryChange(subCat.id)}
                                  style={{ accentColor: 'var(--rosegold)', width: 13, height: 13, cursor: 'pointer' }}
                                />
                                <span style={{ fontWeight: isSubActive ? 600 : 400 }}>{subCat.nom}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </FilterBlock>

              {/* Brands */}
              <FilterBlock label="Marques" onClear={filters.brand ? () => setFilter('brand', '') : null}>
                {brands.map(brand => (
                  <label key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 0' }}>
                    <input type="radio" className="filter-radio" checked={filters.brand === String(brand.id)} onChange={() => setFilter('brand', String(brand.id))} />
                    <span style={{ fontSize: 13.5, color: '#5a5550' }}>{brand.nom}</span>
                  </label>
                ))}
              </FilterBlock>

              {/* Price Range */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--rosegold)', marginBottom: 12 }}>BUDGET (MAD)</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" placeholder="Min" value={filters.min_price} onChange={e => setFilter('min_price', e.target.value)} className="input-lux-select" style={{ padding: '9px 12px', width: '100%' }} />
                  <input type="number" placeholder="Max" value={filters.max_price} onChange={e => setFilter('max_price', e.target.value)} className="input-lux-select" style={{ padding: '9px 12px', width: '100%' }} />
                </div>
              </div>
              
            </div>
          </aside>

          {/* PRODUCT LIST & PAGINATION */}
          <div style={{ flex: 1 }}>
            {loading ? <Loading /> : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                  {products.length > 0 ? (
                    products.map(p => <ProductCard key={p.id} product={p} />)
                  ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#5a5550', padding: '40px 0' }}>Aucun produit trouvé.</p>
                  )}
                </div>

                {/* PAGINATION COMPONENT */}
                {lastPage > 1 && (
                  <div className="pagination-container">
                    <button className="pagination-btn" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Précédent</button>
                    {Array.from({ length: lastPage }, (_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button key={pageNum} className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`} onClick={() => changePage(pageNum)}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button className="pagination-btn" onClick={() => changePage(currentPage + 1)} disabled={currentPage === lastPage}>Suivant</button>
                  </div>
                )}
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ label, children, onClear }) {
  return (
    <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--rosegold)', margin: 0 }}>{label}</p>
        {onClear && <button onClick={onClear} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#5a5550', opacity: 0.6 }}>Effacer</button>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {children}
      </div>
    </div>
  );
}