import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripRequestService, type TripRequest } from '../../../services/triprequest.service';
import { ArrowLeft, Calendar, Inbox, Plus, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/badges/StatusBadge';
import DataTable, { Column } from '../../../components/tables/DataTable';
import '../../../styles/pages/TripRequests.css';
import '../../../styles/pages/Dashboard.css';

export const MyTripRequests = () => {
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const response = await tripRequestService.getMyRequests();
      if (response.success) {
        setRequests(response.data);
      } else {
        toast.error('Failed to load trip requests');
      }
    } catch (error) {
      console.error('Failed to fetch requests', error);
      toast.error('Failed to load trip requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRowClick = (req: TripRequest) => {
    // If proposal is ready, clicking row can take user to proposal details
    if (req.status === 'PROPOSAL_READY') {
      // Find the associated proposal ID if possible. Usually trip-requests fetch has proposals.
      // Let's check backend schema: TripRequest has proposals list.
      const proposalId = (req as any).proposals?.[0]?.id;
      if (proposalId) {
        navigate(`/dashboard/proposals/${proposalId}`);
      }
    }
  };

  if (isLoading) return <LoadingSpinner message="Checking your safari requests..." />;

  const columns: Column<TripRequest>[] = [
    {
      key: 'destination',
      header: 'Destination',
      render: (item) => (
        <span className="text-bold">{item.destination?.name || 'Safari Package'}</span>
      )
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (item) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'travelers',
      header: 'TravelersCount',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => {
        const proposalId = (item as any).proposals?.[0]?.id;
        if (item.status === 'PROPOSAL_READY' && proposalId) {
          return (
            <Link to={`/dashboard/proposals/${proposalId}`} className="btn btn-outline btn-sm">
              <Eye size={12} className="mr-1" /> View Proposal
            </Link>
          );
        }
        return <span className="text-muted" style={{ fontSize: '0.75rem' }}>No action available</span>;
      }
    }
  ];

  return (
    <div className="dashboard-container fade-in">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="trip-requests-header">
        <div>
          <h1 className="dashboard-header-title">My Trip Requests</h1>
          <p className="dashboard-header-subtitle">Review, track, and manage all your submitted trip details.</p>
        </div>
        <Link to="/trip-request/new" className="trip-requests-new-btn">
          <Plus size={18} className="mr-2" /> New Request
        </Link>
      </div>

      <div className="trip-requests-content">

        {requests.length === 0 ? (
          <EmptyState
            icon={<Inbox size={48} />}
            title="No Trip Requests"
            description="You haven't requested any safari trips yet. Our experts will craft custom proposals once you submit a request."
            actionText="Create Trip Request"
            onAction={() => navigate('/trip-request/new')}
          />
        ) : (
          <DataTable
            columns={columns}
            data={requests}
            onRowClick={handleRowClick}
            emptyMessage="No trip requests available"
          />
        )}
      </div>
    </div>
  );
};

export default MyTripRequests;
