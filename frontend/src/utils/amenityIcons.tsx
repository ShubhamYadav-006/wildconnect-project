/* ==========================================================
   Shared Amenity & Category Icons Utility
   ----------------------------------------------------------
   Purpose:
   Centralized icon resolver for amenities, property services,
   and business categories across all public directory & detail pages.
   ========================================================== */

import React from 'react';
import {
  Wifi,
  Utensils,
  Tractor,
  Sparkles,
  Flame,
  Wind,
  Trees,
  Check,
  Coffee,
  Car,
  Tv,
  Clock,
  Camera,
  Compass,
  TreePine,
  ShieldCheck,
  Users,
  MapPin,
  Tag
} from 'lucide-react';

/**
 * Returns a contextual icon component for a given amenity string.
 */
export const renderAmenityIcon = (amenity: string, size = 18): React.ReactNode => {
  const a = (amenity || '').toLowerCase().trim();

  if (a.includes('wifi') || a.includes('internet')) return <Wifi size={size} />;
  if (a.includes('organic') || a.includes('dining') || a.includes('food') || a.includes('restaurant') || a.includes('breakfast') || a.includes('meal')) {
    return <Utensils size={size} />;
  }
  if (a.includes('farm') || a.includes('tractor') || a.includes('tour') || a.includes('orchard')) {
    return <Tractor size={size} />;
  }
  if (a.includes('pool') || a.includes('swimming') || a.includes('spa')) {
    return <Sparkles size={size} />;
  }
  if (a.includes('bonfire') || a.includes('campfire') || a.includes('fireplace') || a.includes('flame')) {
    return <Flame size={size} />;
  }
  if (a.includes('ac') || a.includes('air conditioning') || a.includes('cooling') || a.includes('cottage')) {
    return <Wind size={size} />;
  }
  if (a.includes('tree') || a.includes('nature') || a.includes('garden') || a.includes('forest') || a.includes('trail')) {
    return <Trees size={size} />;
  }
  if (a.includes('coffee') || a.includes('tea') || a.includes('cafe')) {
    return <Coffee size={size} />;
  }
  if (a.includes('parking') || a.includes('safari') || a.includes('cab') || a.includes('transfer') || a.includes('gypsy') || a.includes('vehicle')) {
    return <Car size={size} />;
  }
  if (a.includes('tv') || a.includes('television')) {
    return <Tv size={size} />;
  }
  if (a.includes('desk') || a.includes('service') || a.includes('24') || a.includes('clock') || a.includes('hours')) {
    return <Clock size={size} />;
  }
  if (a.includes('camera') || a.includes('photo') || a.includes('lens') || a.includes('photography')) {
    return <Camera size={size} />;
  }
  if (a.includes('guide') || a.includes('naturalist') || a.includes('driver')) {
    return <Compass size={size} />;
  }

  return <Check size={size} />;
};

/**
 * Returns a category badge icon based on business type or icon identifier string.
 */
export const renderCategoryBadgeIcon = (categoryOrIcon?: string, size = 14): React.ReactNode => {
  const c = (categoryOrIcon || '').toLowerCase().trim();

  if (c.includes('tractor') || c.includes('farm') || c.includes('agri')) return <Tractor size={size} />;
  if (c.includes('resort') || c.includes('lodge') || c.includes('stay') || c.includes('hotel')) return <TreePine size={size} />;
  if (c.includes('safari') || c.includes('driver') || c.includes('vehicle')) return <Car size={size} />;
  if (c.includes('guide') || c.includes('naturalist')) return <Compass size={size} />;
  if (c.includes('camera') || c.includes('photo') || c.includes('gear')) return <Camera size={size} />;
  if (c.includes('shield') || c.includes('verified')) return <ShieldCheck size={size} />;
  if (c.includes('group') || c.includes('users')) return <Users size={size} />;
  if (c.includes('pin') || c.includes('location')) return <MapPin size={size} />;
  if (c.includes('tag')) return <Tag size={size} />;

  return <Compass size={size} />;
};
