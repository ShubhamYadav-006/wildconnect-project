import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { proposalService, type Proposal } from '../../../services/proposal.service';
import { resortService, type Resort } from '../../../services/resort.service';
import { ArrowLeft, Calendar, DollarSign, Compass, Info, Check, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import StatusBadge from '../../../components/badges/StatusBadge';
import Card from '../../../components/cards/Card';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import ConfirmationDialog from '../../../components/modals/ConfirmationDialog';
import '../../../styles/pages/ProposalDetails.css';

export const ProposalDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Phase 5 States
  const [isChangeRequestOpen, setIsChangeRequestOpen] = useState(false);
  const [changeRequestMsg, setChangeRequestMsg] = useState('');
  const [isSendingChangeRequest, setIsSendingChangeRequest] = useState(false);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      if (!id) return;
      try {
        const response = await proposalService.getById(id);
        if (response.success) {
          setProposal(response.data);

          // Fetch associated resorts if any
          const resortIds = response.data.resortIds || [];
          if (resortIds.length > 0) {
            const resortPromises = resortIds.map((rId: string) =>
              resortService.getAll().then(res => {
                if (res.success) {
                  return res.data.find((item: Resort) => item.id === rId);
                }
                return null;
              })
            );
            const resolvedResorts = await Promise.all(resortPromises);
            setResorts(resolvedResorts.filter(Boolean));
          }
        } else {
          toast.error('Failed to load proposal details');
        }
      } catch (error) {
        console.error('Failed to fetch proposal details', error);
        toast.error('Failed to load proposal details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposalDetails();
  }, [id]);

  const handleAction = (type: 'accept' | 'reject') => {
    setActionType(type);
    setIsConfirmOpen(true);
  };

  const confirmAction = async () => {
    if (!id || !actionType) return;
    setIsProcessing(true);
    try {
      let response;
      if (actionType === 'accept') {
        response = await proposalService.accept(id);
      } else {
        response = await proposalService.reject(id);
      }

      if (response.success) {
        toast.success(`Proposal ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully!`);
        // Refresh proposal details
        setProposal({
          ...proposal!,
          status: actionType === 'accept' ? 'ACCEPTED' : 'REJECTED'
        });
      } else {
        toast.error(response.message || `Failed to ${actionType} proposal`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${actionType} proposal`);
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
      setActionType(null);
    }
  };

  const handleSubmitChangeRequest = async () => {
    if (!id) return;

    if (changeRequestMsg.length < 10) {
      toast.error('Please provide at least 10 characters detailing what you want to change.');
      return;
    }
    if (changeRequestMsg.length > 1000) {
      toast.error('Your request is too long. Please keep it under 1000 characters.');
      return;
    }

    setIsSendingChangeRequest(true);
    try {
      const response = await proposalService.requestChanges(id, changeRequestMsg);
      if (response.success) {
        toast.success('Change request submitted successfully!');
        setProposal({
          ...proposal!,
          status: 'CHANGE_REQUESTED',
          changeRequest: changeRequestMsg
        });
        setIsChangeRequestOpen(false);
      } else {
        toast.error(response.message || 'Failed to submit change request');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit change request');
    } finally {
      setIsSendingChangeRequest(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Fetching proposal details..." />;
  if (!proposal) return (
    <div className="page-wrapper text-center">
      <ShieldAlert size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
      <h2 className="h2-title">Proposal Not Found</h2>
      <p className="text-muted">The proposal you are looking for does not exist or has been deleted.</p>
      <Link to="/dashboard" className="btn btn-outline btn-md mt-4">Go to Dashboard</Link>
    </div>
  );

  const itinerary = Array.isArray(proposal.dayWiseItinerary)
    ? proposal.dayWiseItinerary
    : typeof proposal.dayWiseItinerary === 'string'
      ? JSON.parse(proposal.dayWiseItinerary)
      : [];

  const renderFormattedProposal = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      const knownHeadings = [
        'TRIP OVERVIEW',
        'YOUR STAY',
        'YOUR SAFARI PLAN',
        'YOUR ITINERARY',
        'WHAT\'S INCLUDED',
        'WHAT\'S NOT INCLUDED',
        'PRICE SUMMARY',
        'PAYMENT SUMMARY',
        'IMPORTANT TO KNOW',
        'PROPOSAL VALIDITY',
        'WILDCONNECT'
      ];

      const isHeading = knownHeadings.includes(trimmed.toUpperCase()) ||
        (/^[A-Z\s'&]+$/.test(trimmed) && trimmed.length > 3 && trimmed.length < 50);

      if (isHeading) {
        return (
          <h3 key={index} className="tourist-proposal-heading">
            {trimmed}
          </h3>
        );
      }

      if (trimmed === '') {
        return <div key={index} className="tourist-proposal-blank-line" />;
      }

      return (
        <p key={index} className="tourist-proposal-line">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="page-wrapper fade-in proposal-details-page">
      <Link to="/dashboard" className="inline-flex items-center text-link mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="page-header-row">
        <div>
          <h1 className="h1-title">Proposal Details</h1>
          <p className="text-muted mt-1">Review the custom safari details crafted for you.</p>
        </div>
        <StatusBadge status={proposal.status} />
      </div>

      {proposal.content ? (
        <div className="tourist-proposal-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div className="tourist-proposal-document">
            {renderFormattedProposal(proposal.content)}
          </div>
          <PrimaryButton onClick={() => handleAction('accept')} style={{ minWidth: '160px' }}>
            Accept Proposal
          </PrimaryButton>
          {/* Action Buttons */}
          {(proposal.status === 'SENT' || proposal.status === 'PENDING') && (
            <div className="proposal-need-something-else">
              <h3 className="h3-title">Need Something Else?</h3>
              <p className="text-muted">
                If you'd like to add anything else to your trip, including additional services, activities, transportation, or special arrangements, please let us know. We'll do our best to arrange it for you.
              </p>
              <div className="tourist-proposal-actions">
                <PrimaryButton onClick={() => handleAction('accept')} style={{ minWidth: '160px' }}>
                  Accept Proposal
                </PrimaryButton>
                <SecondaryButton onClick={() => setIsChangeRequestOpen(true)} variant="outline" style={{ minWidth: '160px' }}>
                  Request Changes
                </SecondaryButton>
              </div>
            </div>
          )}

          {proposal.status === 'ACCEPTED' && (
            <div className="tourist-proposal-status-banner accepted" style={{ width: '100%', maxWidth: '800px' }}>
              <Check size={16} /> Proposal Accepted! Our team is finalizing your booking.
            </div>
          )}

          {proposal.status === 'CHANGE_REQUESTED' && (
            <div className="tourist-proposal-status-banner change-requested" style={{ width: '100%', maxWidth: '800px' }}>
              <Info size={16} /> Change Request Submitted: "{proposal.changeRequest}"
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Main Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
              <Card.Header>
                <h2 className="h3-title" style={{ margin: 0 }}>Itinerary & Plan</h2>
              </Card.Header>
              <Card.Body>
                {itinerary.length === 0 ? (
                  <p className="text-muted">No itinerary details provided.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid var(--color-border)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
                    {itinerary.map((day: any, idx: number) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        {/* Node Bullet */}
                        <div style={{
                          position: 'absolute',
                          left: '-2.05rem',
                          top: '0.25rem',
                          width: '12px',
                          height: '12px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--color-primary)',
                          border: '3px solid #ffffff'
                        }} />
                        <h4 className="h4-title" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                          Day {day.day || idx + 1}: {day.title || 'Safari Activities'}
                        </h4>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
                          {day.description || (Array.isArray(day.activities) ? day.activities.join(', ') : '')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {resorts.length > 0 && (
              <Card>
                <Card.Header>
                  <h2 className="h3-title" style={{ margin: 0 }}>Recommended Accommodations</h2>
                </Card.Header>
                <Card.Body>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {resorts.map((resort) => (
                      <div key={resort.id} style={{ display: 'flex', gap: '1.5rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
                        {resort.coverImage && (
                          <img src={resort.coverImage} alt={resort.name} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
                        )}
                        <div>
                          <h4 className="h4-title" style={{ margin: 0 }}>{resort.name}</h4>
                          <p className="text-muted" style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '0.875rem' }}>{resort.address}</p>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '4px', fontWeight: 600 }}>
                            ★ {resort.starRating} Star
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Pricing Summary & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
              <Card.Header>
                <h2 className="h3-title" style={{ margin: 0 }}>Summary</h2>
              </Card.Header>
              <Card.Body>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="flex-between">
                    <span className="text-muted flex-row-center"><Compass size={16} className="mr-2" /> Destination</span>
                    <span className="text-bold">{proposal.destination?.name}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted flex-row-center"><Calendar size={16} className="mr-2" /> Duration</span>
                    <span className="text-bold">{proposal.numberOfNights} Nights</span>
                  </div>
                  <div className="border-t" style={{ margin: '0.5rem 0' }} />
                  <div className="flex-between">
                    <span className="text-muted flex-row-center" style={{ fontWeight: 600 }}><DollarSign size={16} className="mr-2" /> Price</span>
                    <span className="h2-title" style={{ color: 'var(--color-primary)' }}>₹{proposal.totalPrice.toLocaleString('en-IN')}</span>
                  </div>

                  {proposal.notes && (
                    <div style={{ marginTop: '1rem', backgroundColor: '#fafaf9', padding: '1rem', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem' }}>
                      <div className="flex-row-center text-bold" style={{ marginBottom: '0.25rem', gap: '0.25rem' }}>
                        <Info size={14} /> Notes:
                      </div>
                      <p className="text-muted" style={{ margin: 0 }}>{proposal.notes}</p>
                    </div>
                  )}

                  {(proposal.status === 'PENDING' || proposal.status === 'SENT') && (
                    <div className="proposal-need-something-else mt-4">
                      <h4 className="h4-title">Need Something Else?</h4>
                      <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                        If you'd like to add anything else to your trip, including additional services, activities, transportation, or special arrangements, please let us know. We'll do our best to arrange it for you.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                        <PrimaryButton onClick={() => handleAction('accept')} fullWidth>
                          <Check size={18} className="mr-2" /> Accept Proposal
                        </PrimaryButton>
                        <SecondaryButton onClick={() => setIsChangeRequestOpen(true)} variant="outline" fullWidth>
                          <Info size={18} className="mr-2" /> Request Changes
                        </SecondaryButton>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmAction}
        title={`${actionType === 'accept' ? 'Accept' : 'Reject'} Travel Proposal?`}
        message={`Are you sure you want to ${actionType === 'accept' ? 'accept' : 'reject'} this proposal? This action will finalize your choice and update the admin team.`}
        confirmText={`Yes, ${actionType === 'accept' ? 'Accept' : 'Reject'}`}
        isDanger={actionType === 'reject'}
        isLoading={isProcessing}
      />

      {/* Change Request Modal */}
      {isChangeRequestOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '32rem', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">What would you like us to change?</h3>
              <button
                onClick={() => setIsChangeRequestOpen(false)}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <textarea
                value={changeRequestMsg}
                onChange={(e) => setChangeRequestMsg(e.target.value)}
                placeholder="Enter details of changes you'd like (e.g. resort preference, dates shift, price review)..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  resize: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setIsChangeRequestOpen(false)}
                className="btn btn-outline btn-sm"
                disabled={isSendingChangeRequest}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitChangeRequest}
                className="btn btn-primary btn-sm"
                disabled={isSendingChangeRequest || changeRequestMsg.length < 10 || changeRequestMsg.length > 1000}
              >
                {isSendingChangeRequest ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalDetails;
