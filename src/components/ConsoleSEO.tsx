import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ConsoleSEOProps {
  console?: string;
}

const ConsoleSEO: React.FC<ConsoleSEOProps> = ({ console }) => {
  if (!console || console === 'all') return null;

  const getConsoleData = (consoleName: string) => {
    const consoleData: { [key: string]: { title: string; description: string; keywords: string } } = {
      'Dreamcast': {
        title: 'Dreamcast Reproduction Games | Konis Games and More',
        description: 'High-quality Sega Dreamcast reproduction games. Rare and hard-to-find Dreamcast titles made affordable. Custom cases and professional quality discs.',
        keywords: 'dreamcast games, sega dreamcast, dreamcast reproduction, rare dreamcast games, custom dreamcast games, dreamcast discs, dreamcast collection'
      },
      'GameCube': {
        title: 'GameCube Reproduction Games | Konis Games and More',
        description: 'Premium Nintendo GameCube reproduction games. Rare GameCube titles with custom cases and professional quality discs. Affordable gaming classics.',
        keywords: 'gamecube games, nintendo gamecube, gamecube reproduction, rare gamecube games, custom gamecube games, gamecube discs, gamecube collection'
      },
      'GB/GBA/GBC': {
        title: 'Game Boy Reproduction Games | GBA, GBC | Konis Games and More',
        description: 'Authentic Game Boy, Game Boy Color, and Game Boy Advance reproduction cartridges. Rare handheld games made affordable with quality components.',
        keywords: 'game boy games, gameboy advance, game boy color, gba games, gbc games, gameboy reproduction, handheld games, portable gaming'
      },
      'Jaguar': {
        title: 'Atari Jaguar Reproduction Games | Konis Games and More',
        description: 'Rare Atari Jaguar reproduction cartridges. Hard-to-find Jaguar games made affordable with authentic quality and custom cases.',
        keywords: 'atari jaguar games, jaguar reproduction, rare jaguar games, custom jaguar cartridges, atari jaguar collection, jaguar console games'
      },
      'NES': {
        title: 'NES Reproduction Games | Nintendo Entertainment System | Konis Games and More',
        description: 'Classic Nintendo Entertainment System reproduction cartridges. Rare NES games with authentic quality components and custom labels.',
        keywords: 'nes games, nintendo entertainment system, nes reproduction, rare nes games, custom nes cartridges, nes collection, classic nintendo'
      },
      'Nintendo 64': {
        title: 'Nintendo 64 Reproduction Games | N64 | Konis Games and More',
        description: 'Authentic Nintendo 64 reproduction cartridges. Rare N64 games made affordable with quality components and custom labels.',
        keywords: 'nintendo 64 games, n64 games, nintendo 64 reproduction, rare n64 games, custom n64 cartridges, n64 collection, nintendo 64 console'
      },
      'Nintendo DS': {
        title: 'Nintendo DS Reproduction Games | Konis Games and More',
        description: 'Professional Nintendo DS reproduction cartridges. Rare DS games with quality components and authentic functionality.',
        keywords: 'nintendo ds games, ds reproduction, rare ds games, custom ds cartridges, nintendo ds collection, handheld gaming'
      },
      'Playstation': {
        title: 'PlayStation Reproduction Games | PS1 | Konis Games and More',
        description: 'Quality original PlayStation reproduction games. Rare PS1 titles with professional discs and custom cases.',
        keywords: 'playstation games, ps1 games, playstation reproduction, rare ps1 games, custom playstation discs, ps1 collection, sony playstation'
      },
      'Playstation2': {
        title: 'PlayStation 2 Reproduction Games | PS2 | Konis Games and More',
        description: 'Professional PlayStation 2 reproduction games. Rare PS2 titles with quality discs and custom cases. Free McBoot compatible.',
        keywords: 'playstation 2 games, ps2 games, playstation 2 reproduction, rare ps2 games, custom ps2 discs, ps2 collection, free mcboot'
      },
      'SEGA 32X': {
        title: 'Sega 32X Reproduction Games | Konis Games and More',
        description: 'Rare Sega 32X reproduction cartridges. Hard-to-find 32X games made affordable with quality components and custom labels.',
        keywords: 'sega 32x games, 32x reproduction, rare 32x games, custom 32x cartridges, sega 32x collection, genesis 32x'
      },
      'SEGA CD': {
        title: 'Sega CD Reproduction Games | Konis Games and More',
        description: 'High-quality Sega CD reproduction games. Rare Sega CD titles with professional discs and custom cases.',
        keywords: 'sega cd games, sega cd reproduction, rare sega cd games, custom sega cd discs, sega cd collection, genesis cd'
      },
      'Sega Genesis': {
        title: 'Sega Genesis Reproduction Games | Konis Games and More',
        description: 'Authentic Sega Genesis reproduction cartridges. Rare Genesis games with quality components and custom labels.',
        keywords: 'sega genesis games, genesis reproduction, rare genesis games, custom genesis cartridges, sega genesis collection, megadrive games'
      },
      'Sega Saturn': {
        title: 'Sega Saturn Reproduction Games | Konis Games and More',
        description: 'Professional Sega Saturn reproduction games. Rare Saturn titles with quality discs and Action Replay compatibility.',
        keywords: 'sega saturn games, saturn reproduction, rare saturn games, custom saturn discs, sega saturn collection, action replay, pseudo kai'
      },
      'Super Nintendo': {
        title: 'Super Nintendo Reproduction Games | SNES | Konis Games and More',
        description: 'Premium Super Nintendo reproduction cartridges. Rare SNES games with authentic quality components and custom labels.',
        keywords: 'super nintendo games, snes games, super nintendo reproduction, rare snes games, custom snes cartridges, snes collection'
      },
      'Turbo Grafx/PC Engine': {
        title: 'Turbo Grafx Reproduction Games | PC Engine | Konis Games and More',
        description: 'Quality Turbo Grafx and PC Engine reproduction games. Rare titles with professional components and custom cases.',
        keywords: 'turbo grafx games, pc engine games, turbografx reproduction, rare turbografx games, custom turbografx games, pc engine collection'
      },
      'VIRTUAL BOY': {
        title: 'Virtual Boy Reproduction Games | Nintendo | Konis Games and More',
        description: 'Rare Nintendo Virtual Boy reproduction cartridges. Hard-to-find Virtual Boy games made affordable with quality components.',
        keywords: 'virtual boy games, nintendo virtual boy, virtual boy reproduction, rare virtual boy games, custom virtual boy cartridges'
      }
    };

    return consoleData[consoleName] || {
      title: `${consoleName} Reproduction Games | Konis Games and More`,
      description: `High-quality ${consoleName} reproduction games. Rare and hard-to-find titles made affordable.`,
      keywords: `${consoleName.toLowerCase()} games, ${consoleName.toLowerCase()} reproduction, rare ${consoleName.toLowerCase()} games`
    };
  };

  const data = getConsoleData(console);

  return (
    <Helmet>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      <meta name="keywords" content={data.keywords} />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
    </Helmet>
  );
};

export default ConsoleSEO;