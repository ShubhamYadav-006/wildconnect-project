import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { destinationService, type Destination } from '../../../services/destination.service';
import { resortService, type Resort } from '../../../services/resort.service';
import { tripRequestService } from '../../../services/triprequest.service';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Textarea from '../../../components/forms/Textarea';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import Card from '../../../components/cards/Card';

const tripRequestSchema = z.object({
  destinationId: z.string().min(1, 'Please select a destination'),
  resortId: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  adults: z.number().min(1, 'At least 1 adult required'),
  children: z.number().min(0),
  budget: z.string().optional(),
  specialRequirements: z.string().optional(),
});

type TripRequestFormValues = z.infer<typeof tripRequestSchema>;

export const TripRequestForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialDestination = searchParams.get('destination') || '';
  const initialResort = searchParams.get('resort') || '';

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<TripRequestFormValues>({
    resolver: zodResolver(tripRequestSchema),
    defaultValues: {
      destinationId: initialDestination,
      resortId: initialResort,
      adults: 2,
      children: 0,
    }
  });

  const selectedDestinationId = watch('destinationId');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationService.getAll();
        if (response.success) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch destinations', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchResorts = async () => {
      if (!selectedDestinationId) {
        setResorts([]);
        return;
      }
      try {
        const response = await resortService.getByDestination(selectedDestinationId);
        if (response.success) {
          setResorts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch resorts', error);
      }
    };
    fetchResorts();
  }, [selectedDestinationId]);

  const onSubmit = async (data: TripRequestFormValues) => {
    try {
      const preferredResort = resorts.find(r => r.id === data.resortId);
      const notes = preferredResort ? `Preferred Resort: ${preferredResort.name}` : undefined;

      const requestData = {
        destinationId: data.destinationId,
        travelerCount: (data.adults || 0) + (data.children || 0),
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        budget: data.budget || undefined,
        preferences: data.specialRequirements || undefined,
        notes: notes,
      };

      const response = await tripRequestService.create(requestData);
      if (response.success) {
        toast.success('Trip request submitted successfully!');
        navigate('/dashboard/requests');
      } else {
        toast.error(response.message || 'Failed to submit request');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    }
  };

  if (isLoading) return <LoadingSpinner message="Opening safari inquiry form..." />;

  const destinationOptions = destinations.map(d => ({ value: d.id, label: d.name }));
  const resortOptions = resorts.map(r => ({ value: r.id, label: r.name }));

  return (
    <div className="fade-in" style={{ maxWidth: '42rem', margin: '0 auto' }}>
      <Link to="/dashboard" className="inline-flex items-center text-link mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>

      <Card>
        <Card.Header>
          <h1 className="h2-title" style={{ margin: 0 }}>Request a Custom Trip</h1>
          <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
            Detail your travel specifications below, and our park experts will build your custom safari plan.
          </p>
        </Card.Header>
        
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Destination & Resort Selection */}
            <div className="grid-cols-2" style={{ display: 'grid', gap: '1rem' }}>
              <Select
                label="Destination *"
                options={destinationOptions}
                error={errors.destinationId?.message}
                {...register('destinationId')}
                onChange={(e) => {
                  setValue('destinationId', e.target.value);
                  setValue('resortId', ''); // Reset resort selection when destination changes
                }}
              />

              <Select
                label="Preferred Resort (Optional)"
                options={resortOptions}
                disabled={!selectedDestinationId || resorts.length === 0}
                {...register('resortId')}
              >
                <option value="">No preference</option>
                {resorts.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Select>
            </div>

            {/* Travel Dates */}
            <div className="grid-cols-2" style={{ display: 'grid', gap: '1rem' }}>
              <Input
                label="Start Date *"
                type="date"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
              <Input
                label="End Date *"
                type="date"
                error={errors.endDate?.message}
                {...register('endDate')}
              />
            </div>

            {/* Guests & Budget */}
            <div className="grid-cols-3" style={{ display: 'grid', gap: '1rem' }}>
              <Input
                label="Adults *"
                type="number"
                min={1}
                error={errors.adults?.message}
                {...register('adults', { valueAsNumber: true })}
              />

              <Input
                label="Children"
                type="number"
                min={0}
                {...register('children', { valueAsNumber: true })}
              />

              <Input
                label="Total Budget (Optional)"
                type="text"
                placeholder="₹50,000"
                {...register('budget')}
              />
            </div>

            {/* Special Instructions */}
            <Textarea
              label="Special Instructions / Preferences"
              placeholder="List specific safari gates, zones, tour guides, dietary preferences or accessibility needs..."
              rows={4}
              {...register('specialRequirements')}
            />

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', textAlign: 'center' }}>
              <PrimaryButton type="submit" disabled={isSubmitting} fullWidth>
                <Send size={16} className="mr-2" /> {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
              </PrimaryButton>
              <p className="text-xs-muted mt-3" style={{ margin: '0.5rem 0 0 0' }}>
                Submitting this form does not lock you into a booking. It alerts our coordinators to start drafting your options.
              </p>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TripRequestForm;
