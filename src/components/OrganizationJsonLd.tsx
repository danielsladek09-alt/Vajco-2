import { siteConfig, pickup, products, formatPrice, getProductPrice } from "@/config/site";

/** Schema.org strukturovaná data — pomáhá vyhledávačům pochopit, co VAJCO nabízí. */
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: pickup.city,
      addressRegion: "Jihomoravský kraj",
      addressCountry: "CZ",
    },
    makesOffer: products.items.map((product) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: product.label,
        description: product.description,
      },
      price: getProductPrice(product.id),
      priceCurrency: "CZK",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: getProductPrice(product.id),
        priceCurrency: "CZK",
        description: formatPrice(getProductPrice(product.id)),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
