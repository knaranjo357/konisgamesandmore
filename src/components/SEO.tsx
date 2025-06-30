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
  title = "Konis Games and More | Retro Gaming Paradise - Reproduction Games for All Consoles",
  description = "Your premier destination for high-quality reproduction games for retro consoles. We offer thousands of titles for Dreamcast, GameCube, NES, Nintendo 64, PlayStation, Sega Genesis, Super Nintendo and more. Rare games made affordable!",
  keywords = "reproduction games, retro games, dreamcast games, gamecube games, nintendo 64 games, nes games, playstation games, playstation 2 games, sega genesis games, super nintendo games, sega saturn games, sega cd games, turbo grafx games, virtual boy games, gameboy games, nintendo ds games, atari jaguar games, sega 32x games, rare games, vintage games, classic games, retro gaming, game reproductions, custom games, hard to find games, expensive games alternative, retro console games, vintage gaming collection",
  url = "https://konisgamesandmore.com",
  image = "https://konisgamesandmore.com/logokonisgames.png",
  type = "website"
}) => {
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
    "openingHours": "Mo-Su 00:00-23:59",
    "priceRange": "$5-$50",
    "paymentAccepted": "Credit Card, Debit Card",
    "currenciesAccepted": "USD",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Retro Game Reproductions",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Dreamcast Reproduction Games",
            "description": "High-quality reproduction games for Sega Dreamcast console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "GameCube Reproduction Games",
            "description": "Premium reproduction games for Nintendo GameCube console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Nintendo 64 Reproduction Games",
            "description": "Authentic reproduction cartridges for Nintendo 64 console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "NES Reproduction Games",
            "description": "Classic reproduction games for Nintendo Entertainment System"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "PlayStation Reproduction Games",
            "description": "Quality reproduction discs for original PlayStation console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "PlayStation 2 Reproduction Games",
            "description": "Professional reproduction games for PlayStation 2 console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sega Genesis Reproduction Games",
            "description": "Authentic reproduction cartridges for Sega Genesis console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Super Nintendo Reproduction Games",
            "description": "Premium reproduction cartridges for Super Nintendo Entertainment System"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sega Saturn Reproduction Games",
            "description": "High-quality reproduction discs for Sega Saturn console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sega CD Reproduction Games",
            "description": "Professional reproduction discs for Sega CD console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Turbo Grafx Reproduction Games",
            "description": "Quality reproduction games for Turbo Grafx/PC Engine console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Virtual Boy Reproduction Games",
            "description": "Rare reproduction cartridges for Nintendo Virtual Boy console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Game Boy Reproduction Games",
            "description": "Authentic reproduction cartridges for Game Boy, Game Boy Color, and Game Boy Advance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Nintendo DS Reproduction Games",
            "description": "Professional reproduction cartridges for Nintendo DS console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Atari Jaguar Reproduction Games",
            "description": "Rare reproduction cartridges for Atari Jaguar console"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sega 32X Reproduction Games",
            "description": "Quality reproduction cartridges for Sega 32X console"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Konis Games and More" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Konis Games and More" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@konisgames" />
      <meta name="twitter:creator" content="@konisgames" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#7c3aed" />
      <meta name="msapplication-TileColor" content="#7c3aed" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* Geo Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      {/* Business Information */}
      <meta name="contact" content="jfpcontracting00@gmail.com" />
      <meta name="category" content="Gaming, Retro Games, Video Games, Entertainment" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional Console-Specific Meta Tags */}
      <meta name="dreamcast-games" content="Sega Dreamcast reproduction games, rare dreamcast titles, custom dreamcast games" />
      <meta name="gamecube-games" content="Nintendo GameCube reproduction games, rare gamecube titles, custom gamecube games" />
      <meta name="nintendo64-games" content="Nintendo 64 reproduction cartridges, rare n64 games, custom n64 cartridges" />
      <meta name="nes-games" content="Nintendo Entertainment System reproduction games, rare nes cartridges, custom nes games" />
      <meta name="playstation-games" content="PlayStation reproduction games, rare ps1 titles, custom playstation discs" />
      <meta name="playstation2-games" content="PlayStation 2 reproduction games, rare ps2 titles, custom ps2 discs" />
      <meta name="genesis-games" content="Sega Genesis reproduction cartridges, rare genesis games, custom genesis cartridges" />
      <meta name="snes-games" content="Super Nintendo reproduction cartridges, rare snes games, custom snes cartridges" />
      <meta name="saturn-games" content="Sega Saturn reproduction games, rare saturn titles, custom saturn discs" />
      <meta name="segacd-games" content="Sega CD reproduction games, rare sega cd titles, custom sega cd discs" />
      <meta name="turbografx-games" content="Turbo Grafx reproduction games, PC Engine games, rare turbografx titles" />
      <meta name="virtualboy-games" content="Nintendo Virtual Boy reproduction cartridges, rare virtual boy games" />
      <meta name="gameboy-games" content="Game Boy reproduction cartridges, Game Boy Color games, Game Boy Advance games" />
      <meta name="nintendods-games" content="Nintendo DS reproduction cartridges, rare ds games, custom ds cartridges" />
      <meta name="jaguar-games" content="Atari Jaguar reproduction cartridges, rare jaguar games, custom jaguar cartridges" />
      <meta name="sega32x-games" content="Sega 32X reproduction cartridges, rare 32x games, custom 32x cartridges" />
    </Helmet>
  );
};

export default SEO;