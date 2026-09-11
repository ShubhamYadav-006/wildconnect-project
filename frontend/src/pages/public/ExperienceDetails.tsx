import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { experienceService, type Experience } from '../../services/experience.service';
import { Calendar, User as UserIcon, ArrowLeft, Star } from 'lucide-react';

const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      try {
        const response = await experienceService.getById(id);
        if (response.success) {
          setExperience(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch experience details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  if (isLoading) return <div className="min-h-[60vh] flex justify-center items-center">Loading experience...</div>;
  if (!experience) return <div className="min-h-[60vh] flex justify-center items-center">Experience not found</div>;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-6 w-6 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/experiences" className="inline-flex items-center text-[var(--color-primary)] hover:underline mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Experiences
      </Link>

      <div className="card p-8 md:p-12 mb-12 border-t-4 border-t-[var(--color-primary)]">
        <div className="flex mb-6">
          {renderStars(experience.rating)}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8">{experience.title}</h1>

        <div className="prose prose-lg max-w-none text-[var(--color-text-primary)] italic border-l-4 border-gray-200 pl-6 mb-12">
          {experience.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {(experience.images && experience.images.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {experience.images.map((img, idx) => (
              <img key={idx} src={img} alt="Experience" className="w-full h-64 object-cover rounded-lg" />
            ))}
          </div>
        ) : (experience.featuredImage && (
          <div className="w-full h-64 md:h-[400px] rounded-xl overflow-hidden mb-12">
            <img src={experience.featuredImage} alt={experience.title} className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6 mt-8">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-[var(--color-primary)/0.1] text-[var(--color-primary)] flex items-center justify-center mr-4">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-[var(--color-text-primary)]">{experience.author?.firstName || 'Anonymous Traveler'}</p>
              <p className="text-sm text-[var(--color-text-muted)]">Verified Booking</p>
            </div>
          </div>
          <div className="flex items-center text-[var(--color-text-muted)]">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(experience.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
