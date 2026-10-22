import { useEffect, useMemo, useState } from 'react'
import {
  CameraIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import products from './data/products.json'
import siteContent from './data/siteContent.json'
import './App.css'

const currency = siteContent.currency || '$'

const fallbackDetails = {
  notes: ['acordes luminosos', 'maderas suaves', 'almizcle blanco'],
  duration: '6 a 8 horas con intensidad equilibrada',
  volume: '100 ml / aroma de autor',
}

function getProductDetails(product) {
  return product.details || fallbackDetails
}

function getProductPrice(product, showWholesale = false) {
  if (showWholesale && product.wholesalePrice !== undefined) {
    return product.wholesalePrice
  }
  return product.retailPrice || product.wholesalePrice || 0
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedSegment, setSelectedSegment] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isMobileHeaderHidden, setIsMobileHeaderHidden] = useState(false)
  const [showWholesalePrices, setShowWholesalePrices] = useState(false)
  const categories = ['Todos', ...new Set(products.map((product) => product.category))]
  const segments = ['Todos', ...new Set(products.map((product) => product.segment))]

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      if (window.innerWidth > 640) {
        setIsMobileHeaderHidden(false)
        return
      }

      const currentScrollY = window.scrollY

      if (currentScrollY <= 12 || currentScrollY < previousScrollY) {
        setIsMobileHeaderHidden(false)
      } else if (currentScrollY > previousScrollY) {
        setIsMobileHeaderHidden(true)
      }

      previousScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory
      const matchesSegment =
        selectedSegment === 'Todos' || product.segment === selectedSegment
      const haystack = [product.name, product.category, product.description]
        .join(' ')
        .toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch)

      return matchesCategory && matchesSegment && matchesSearch
    })
  }, [searchTerm, selectedCategory, selectedSegment])

  const featuredProduct = products.find((product) => product.featured) ?? products[0]

  const socialIconMap = {
    Instagram: CameraIcon,
    Pinterest: MapPinIcon,
    WhatsApp: PhoneIcon,
  }

  return (
    <div className="page-shell">
      <header className={`topbar ${isMobileHeaderHidden ? 'mobile-hidden' : ''}`}>
        <div className="brand-wrap" aria-label={siteContent.brand.name}>
          <img
            src={siteContent.brand.logo1}
            alt={`${siteContent.brand.name} logo`}
            className="brand-logo"
          />
          <div className="brand-text">
            <span className="brand-short">{siteContent.brand.shortName}</span>
            <span className="brand-name">{siteContent.brand.name}</span>
          </div>
        </div>

        <div className="price-toggle-container">
          <label className="price-toggle-label" htmlFor="price-toggle">
            <span className="toggle-label-left">Al detal</span>
            <div className="toggle-switch">
              <input
                id="price-toggle"
                type="checkbox"
                checked={showWholesalePrices}
                onChange={() => setShowWholesalePrices(!showWholesalePrices)}
                aria-label={showWholesalePrices ? "Mostrando precios al mayor" : "Mostrando precios al detal"}
              />
              <span className="toggle-slider"></span>
            </div>
            <span className="toggle-label-right">Al mayor</span>
          </label>
          <div className="price-toggle-hint">
            {showWholesalePrices ? 
              "Precios especiales para compras al por mayor" : 
              "Precios para compras individuales"}
          </div>
        </div>

        <nav className="main-nav" aria-label="Navegación principal">
          {siteContent.navigation.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a
          className="header-cta"
          href="https://wa.me/584124676968"
          target="_blank"
          rel="noreferrer"
          aria-label="Contactar por WhatsApp"
          title="Contactar por WhatsApp"
        >
          <PhoneIcon className="social-icon" aria-hidden="true" />
        </a>
      </header>

      <main>
        <section id="inicio" className="hero section">
          <div className="hero-copy">
            <span className="eyebrow">{siteContent.hero.eyebrow}</span>
            <h1>{siteContent.hero.title}</h1>
            <p>{siteContent.hero.description}</p>

            <div className="hero-actions">
              <a href={siteContent.hero.primaryCta.href} className="primary-btn">
                {siteContent.hero.primaryCta.label}
              </a>
              <a href={siteContent.hero.secondaryCta.href} className="secondary-btn">
                {siteContent.hero.secondaryCta.label}
              </a>
            </div>

            <div className="hero-stats">
              {siteContent.hero.stats.map((stat) => (
                <div className="stat-item" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label="Perfume destacado">
            <article className="feature-card">
              <div className="feature-media">
                <span className="feature-tag">{siteContent.hero.featuredLabel}</span>
                <img src={featuredProduct.imageUrl} alt={featuredProduct.name} />
              </div>

              <div className="feature-content">
                <strong>{featuredProduct.name}</strong>
                <p>{siteContent.hero.featured?.description || featuredProduct.description}</p>
                <div className="floating-price">
                  <span>{siteContent.hero.featured?.priceLabel || 'Precio'}</span>
                  <div className="featured-price-container">
                    <strong className="featured-price-amount">
                      {currency}
                      {getProductPrice(featuredProduct, showWholesalePrices)}
                    </strong>
                    {showWholesalePrices ? (
                      <span className="price-badge wholesale-badge featured-price-badge">Al mayor</span>
                    ) : (
                      <span className="price-badge retail-badge featured-price-badge">Al detal</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="nosotros" className="about section">
          <div className="about-copy">
            <span className="eyebrow">{siteContent.about.eyebrow}</span>
            <h2>{siteContent.about.title}</h2>
            <p>{siteContent.about.description}</p>
            <p className="secondary-copy">{siteContent.about.secondaryDescription}</p>
          </div>

          <div className="about-grid">
            {siteContent.about.stats.map((item) => (
              <div className="about-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="productos" className="catalog section">
          <div className="catalog-header">
            <div>
              <span className="eyebrow">{siteContent.catalog.eyebrow}</span>
              <h2>{siteContent.catalog.title}</h2>
            </div>

            <div className="catalog-tools">
              <label className="search-box" htmlFor="product-search">
                <span className="search-icon">⌕</span>
                <input
                  id="product-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={siteContent.catalog.searchPlaceholder}
                  aria-label={siteContent.catalog.searchLabel}
                />
              </label>

              <div className="select-wrap">
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  aria-label={siteContent.catalog.categoryLabel}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'Todos' ? siteContent.catalog.allCategoriesLabel : category}
                    </option>
                  ))}
                </select>
                <span className="select-arrow" aria-hidden="true">
                  ▾
                </span>
              </div>

              <div className="select-wrap">
                <select
                  value={selectedSegment}
                  onChange={(event) => setSelectedSegment(event.target.value)}
                  aria-label={siteContent.catalog.segmentLabel}
                >
                  {segments.map((segment) => (
                    <option key={segment} value={segment}>
                      {segment === 'Todos' ? siteContent.catalog.allSegmentsLabel : segment}
                    </option>
                  ))}
                </select>
                <span className="select-arrow" aria-hidden="true">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">{siteContent.catalog.emptyMessage}</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>

                  <div className="product-body">
                    <div className="product-meta">
                      <span>{product.category}</span>
                      <span>{siteContent.catalog.availabilityLabel}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-detail-preview">
                      <span>Notas destacadas</span>
                      <strong>{getProductDetails(product).notes.join(' · ')}</strong>
                      <span>Duración</span>
                      <strong>{getProductDetails(product).duration}</strong>
                    </div>
                    <div className="product-footer">
                      <div className="price-container">
                        <strong className="price-amount">
                          {currency}
                          {getProductPrice(product, showWholesalePrices)}
                        </strong>
                        {showWholesalePrices ? (
                          <span className="price-badge wholesale-badge">Al mayor</span>
                        ) : (
                          <span className="price-badge retail-badge">Al detal</span>
                        )}
                      </div>
                      <button type="button" onClick={() => setSelectedProduct(product)}>
                        {siteContent.catalog.detailLabel}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer id="contacto" className="site-footer">
        <div className="footer-brand">
          <div className="brand-wrap" aria-label={siteContent.brand.name}>
            <img
              src={siteContent.brand.logo1}
              alt={`${siteContent.brand.name} logo`}
              className="brand-logo"
            />
            <div className="brand-text">
              <span className="brand-short">{siteContent.brand.shortName}</span>
              <span className="brand-name">{siteContent.brand.name}</span>
            </div>
          </div>
          <p>{siteContent.footer.description}</p>
          <div className="footer-contact-info">
            <p className="contact-subtitle">{siteContent.footer.contactInfo}</p>
            <div className="contact-channels">
              <a href={siteContent.footer.whatsapp} className="contact-channel" target="_blank" rel="noreferrer">
                <PhoneIcon className="contact-icon" aria-hidden="true" />
                <span>WhatsApp: +58 412-4676968</span>
              </a>
              <a href={siteContent.footer.instagram} className="contact-channel" target="_blank" rel="noreferrer">
                <CameraIcon className="contact-icon" aria-hidden="true" />
                <span>Instagram: @minm.fragancias</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <h3>{siteContent.footer.navigationTitle}</h3>
          <ul>
            {siteContent.navigation.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h3>{siteContent.footer.socialTitle}</h3>
          <ul className="social-links-list">
            {siteContent.footer.socialLinks.map((link) => {
              const Icon = socialIconMap[link.label] || LinkIcon

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <Icon className="social-icon" aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </footer>

      <div className="site-note">{siteContent.footer.tagline}</div>

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label={siteContent.modal.closeLabel}
              onClick={() => setSelectedProduct(null)}
            >
              <XMarkIcon className="social-icon" aria-hidden="true" />
            </button>

            <div className="modal-media">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
            </div>

            <div className="modal-copy">
              <span className="eyebrow">{selectedProduct.category}</span>
              <h3>{selectedProduct.name}</h3>
              <div className="modal-price">
                <span className="modal-price-amount">
                  {currency}
                  {getProductPrice(selectedProduct, showWholesalePrices)}
                </span>
                {showWholesalePrices ? (
                  <span className="price-badge wholesale-badge modal-price-badge">Al mayor</span>
                ) : (
                  <span className="price-badge retail-badge modal-price-badge">Al detal</span>
                )}
              </div>
              <p>{selectedProduct.description}</p>

              <div className="detail-list">
                <div>
                  <span>{siteContent.modal.notesLabel}</span>
                  <strong>
                    {getProductDetails(selectedProduct).notes.join(', ')}
                  </strong>
                </div>
                <div>
                  <span>{siteContent.modal.durationLabel}</span>
                  <strong>
                    {getProductDetails(selectedProduct).duration}
                  </strong>
                </div>
                <div>
                  <span>{siteContent.modal.formatLabel}</span>
                  <strong>
                    {getProductDetails(selectedProduct).volume}
                  </strong>
                </div>
              </div>

              <button type="button" className="modal-cta" onClick={() => setSelectedProduct(null)}>
                {siteContent.modal.continueLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
