import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Konis Games | Retro & Reproduction Games - NES, SNES, N64, PS1, PS2 & More",
  description = "High-quality Reproduction Games, Manuals, and Covers. Shop rare classics for Nintendo (NES, SNES, N64, GameCube, GameBoy), Sega (Genesis, Saturn, Dreamcast, CD), PlayStation (PS1, PS2), Turbo Grafx, and Atari. Affordable retro gaming paradise.",
  keywords = "Nintendo Reproduction, Nes Reproduction, Super Nintendo Reproduction, Snes Reproduction, Ds Reproduction, Turbo Grafx Reproduction, Dreamcast Reproduction, Gamecube Reproduction, Gb reproduction, Gba Reproduction, Gameboy Color Reproduction, Atari 2600 reproduction, Atari Jaguar Reproduction, Nintendo 64 Reproduction, Nintendo Ds Reproduction, Ps1 Reproduction, Ps2 Reproduction, PlayStation 1 Reproduction, PlayStation 2 Reproduction, Sega Genesis Reproduction, Sega 32x Reproduction, Sega Cd Reproduction, Sega Saturn Reproduction, Reproduction Games, Reproduction Manuals, Reproduction Covers, custom games, rare games, retro gaming store",
  url = "https://konisgamesandmore.com",
  image = "https://konisgamesandmore.com/logokonisgames.png",
  type = "website"
}) => {
  
  // Datos estructurados optimizados para Tienda Online
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Konis Games and More",
    "description": description,
    "url": url,
    "logo": image,
    "image": image,
    "telephone": "",
    "email": "jfpcontracting00@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "priceRange": "$5-$50",
    "paymentAccepted": "Credit Card, Debit Card",
    "currenciesAccepted": "USD",
    "areaServed": "United States",
    "founder": {
      "@type": "Person",
      "name": "Konis Games"
    },
    "offerCatalog": {
      "@type": "OfferCatalog",
      "name": "Retro Reproduction Games Inventory",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Nintendo Reproduction Games (NES, SNES, N64, GC)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Sega Reproduction Games (Genesis, Dreamcast, Saturn, CD)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "PlayStation Reproduction Games (PS1, PS2)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Handheld Reproductions (GB, GBC, GBA, DS)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Other Retro Consoles (Turbo Grafx, Atari, 3DO)" } }
      ]
    }
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Konis Games and More" />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow, max-image-preview:large" />

      {/* Open Graph / Facebook / Discord */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Konis Games and More" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@konisgames" />

      {/* Technical & PWA Tags */}
      <meta name="theme-color" content="#7c3aed" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;