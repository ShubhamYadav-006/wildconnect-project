/* ==========================================================
   NilawarFarmsDetails Component (Refactored)
   ----------------------------------------------------------
   Delegates directly to generic BusinessDetailsPage component.
   ========================================================== */

import { Business } from '../../services/business.service';
import { Destination } from '../../services/destination.service';
import BusinessDetailsPage from './BusinessDetailsPage';

interface NilawarFarmsDetailsProps {
  business: Business;
  destination: Destination | null;
}

export const NilawarFarmsDetails = ({ business, destination }: NilawarFarmsDetailsProps) => {
  return <BusinessDetailsPage business={business} destination={destination} />;
};

export default NilawarFarmsDetails;
