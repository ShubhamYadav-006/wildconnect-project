import { useState, useEffect } from 'react';
import { experienceService, Experience } from '../../services/experience.service';
import { Star, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experienceService.getAll();
        if (response.success) {
          const experiencesData = Array.isArray(response.data)
            ? response.data
            : (response.data && Array.isArray(response.data.data) ? response.data.data : []);
          setExperiences(experiencesData);
        }
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) {
    return <div className="min-h-[60vh] flex justify-center items-center">Loading experiences...</div>;
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Traveler Experiences</h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Real stories and reviews from wildlife enthusiasts who booked with WildConnect.
        </p>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center p-12 card bg-gray-50">
          <p className="text-[var(--color-text-muted)]">No experiences shared yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <div key={experience.id} className="card p-6 flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex mb-2">
                  {renderStars(experience.rating)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                <Link to={`/experiences/${experience.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                  {experience.title}
                </Link>
              </h3>
              
              <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-grow italic line-clamp-4">
                "{experience.content}"
              </p>
              
              {(experience.featuredImage || (experience.images && experience.images.length > 0)) && (
                <div className="h-32 bg-gray-200 rounded overflow-hidden mb-4">
                  <img src={experience.featuredImage || experience.images[0]} alt="Experience" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="mt-auto flex items-center pt-4 border-t border-[var(--color-border)]">
                <div className="h-8 w-8 rounded-full bg-[var(--color-primary)/0.1] text-[var(--color-primary)] flex items-center justify-center mr-3">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{experience.author?.firstName || 'Anonymous Traveler'}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{new Date(experience.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experiences;
