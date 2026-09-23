/* ==========================================================
   Shared Experience Icons Utility
   ----------------------------------------------------------
   Purpose:
   Contextual icon resolver for experience highlights,
   activities, and what guests can enjoy at wildlife properties.
   ========================================================== */

import React from 'react';
import {
  Compass,
  Trees,
  Binoculars,
  Camera,
  Utensils,
  Sparkles,
  Flame,
  Sun,
  Moon,
  Bird,
  Car,
  Footprints,
  HeartHandshake
} from 'lucide-react';

/**
 * Returns an icon corresponding to a specific experience or activity string.
 */
export const renderExperienceIcon = (experience: string, size = 18): React.ReactNode => {
  const exp = (experience || '').toLowerCase().trim();

  if (exp.includes('safari') || exp.includes('game drive') || exp.includes('gypsy') || exp.includes('tiger')) {
    return <Car size={size} />;
  }
  if (exp.includes('bird') || exp.includes('avian') || exp.includes('ornithology')) {
    return <Bird size={size} />;
  }
  if (exp.includes('photo') || exp.includes('camera') || exp.includes('lens') || exp.includes('hide')) {
    return <Camera size={size} />;
  }
  if (exp.includes('walk') || exp.includes('trail') || exp.includes('trek') || exp.includes('hike')) {
    return <Footprints size={size} />;
  }
  if (exp.includes('sight') || exp.includes('view') || exp.includes('watch') || exp.includes('binoculars')) {
    return <Binoculars size={size} />;
  }
  if (exp.includes('dining') || exp.includes('food') || exp.includes('meal') || exp.includes('organic') || exp.includes('farm to table') || exp.includes('culinary')) {
    return <Utensils size={size} />;
  }
  if (exp.includes('bonfire') || exp.includes('campfire') || exp.includes('stargazing') || exp.includes('night')) {
    return <Flame size={size} />;
  }
  if (exp.includes('nature') || exp.includes('forest') || exp.includes('jungle') || exp.includes('garden') || exp.includes('tree')) {
    return <Trees size={size} />;
  }
  if (exp.includes('pool') || exp.includes('swim') || exp.includes('spa') || exp.includes('relax')) {
    return <Sparkles size={size} />;
  }
  if (exp.includes('sun') || exp.includes('dawn') || exp.includes('sunset') || exp.includes('morning')) {
    return <Sun size={size} />;
  }
  if (exp.includes('night') || exp.includes('nocturnal')) {
    return <Moon size={size} />;
  }
  if (exp.includes('hospitality') || exp.includes('guide') || exp.includes('naturalist') || exp.includes('expert')) {
    return <HeartHandshake size={size} />;
  }

  return <Compass size={size} />;
};
