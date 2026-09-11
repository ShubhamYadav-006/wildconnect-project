import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resortService, Resort } from '../../services/resort.service';
import { useAuth } from '../../hooks/useAuth';
import { MapPin, Star, Wifi, Coffee, Car, Check, Info } from 'lucide-react';

const ResortDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [resort, setResort] = useState<Resort | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResort = async () => {
      if (!slug) return;
      try {
        const response = await resortService.getBySlug(slug);
        if (response.success) {
          setResort(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch resort details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResort();
  }, [slug]);

  if (isLoading) return <div className="min-h-[60vh] flex justify-center items-center">Loading resort...</div>;
  if (!resort) return <div className="min-h-[60vh] flex justify-center items-center">Resort not found</div>;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  const renderAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi')) return <Wifi className="h-5 w-5 mr-3 text-[var(--color-primary)]" />;
    if (a.includes('breakfast') || a.includes('dining')) return <Coffee className="h-5 w-5 mr-3 text-[var(--color-primary)]" />;
    if (a.includes('parking') || a.includes('safari')) return <Car className="h-5 w-5 mr-3 text-[var(--color-primary)]" />;
    return <Check className="h-5 w-5 mr-3 text-[var(--color-primary)]" />;
  };

  const handleBookingRequest = () => {
    if (isAuthenticated) {
      navigate(`/trip-request/new?resort=${resort.id}&destination=${resort.destinationId}`);
    } else {
      navigate('/login', { state: { from: { pathname: `/trip-request/new?resort=${resort.id}&destination=${resort.destinationId}` } } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">{resort.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-[var(--color-text-muted)]">
          <div className="flex">
            {renderStars(resort.starRating)}
          </div>
          {resort.destination && (
            <Link to={`/destinations/${resort.destination.slug}`} className="flex items-center hover:text-[var(--color-primary)] transition-colors">
              <MapPin className="h-4 w-4 mr-1" />
              {resort.destination.name}
            </Link>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 h-[50vh]">
        <div className="md:col-span-2 h-full bg-gray-200 rounded-xl overflow-hidden">
          {resort.images && resort.images.length > 0 ? (
            <img src={resort.images[0]} alt={resort.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex justify-center items-center bg-[var(--color-primary)/0.1] text-[var(--color-primary)] font-medium">No Image Available</div>
          )}
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          {[1, 2].map((idx) => (
            <div key={idx} className="flex-1 bg-gray-200 rounded-xl overflow-hidden">
              {resort.images && resort.images.length > idx && (
                <img src={resort.images[idx]} alt={`${resort.name} ${idx}`} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">About this resort</h2>
            <div className="prose max-w-none text-[var(--color-text-muted)]">
              {resort.description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resort.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center text-[var(--color-text-primary)]">
                  {renderAmenityIcon(amenity)}
                  <span className="text-lg">{amenity}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Booking Sidebar */}
        <div className="relative">
          <div className="card p-6 sticky top-24 shadow-lg border-[var(--color-primary)/0.2]">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-[var(--color-text-primary)]">₹{resort.pricePerNight}</span>
                <span className="text-[var(--color-text-muted)] ml-1">/ night</span>
              </div>
            </div>

            <div className="bg-[var(--color-accent)/0.1] text-[rgb(var(--accent-foreground))] p-4 rounded-lg mb-6 flex items-start">
              <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm">Submit a trip request to check availability and get a customized proposal including safaris and travel.</p>
            </div>

            <button 
              onClick={handleBookingRequest}
              className="btn-primary w-full py-4 text-lg"
            >
              Request to Book
            </button>
            
            <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortDetails;
