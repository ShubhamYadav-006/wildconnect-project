import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

import { tripRequestService } from '../../services/triprequest.service';
import { proposalService } from '../../services/proposal.service';
import toast from 'react-hot-toast';

import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminTripRequests.css';
import '../../styles/globals/modals.css';

const AdminTripRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Proposal Editor Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [activeProposalText, setActiveProposalText] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const [requestsRes, proposalsRes] = await Promise.all([
        tripRequestService.getAll(),
        proposalService.getAll(),
      ]);

      if (requestsRes.success) {
        setRequests(requestsRes.data);
      }
      if (proposalsRes.success) {
        setProposals(proposalsRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch requests/proposals', error);
      toast.error('Failed to load trip requests or proposals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: string
  ) => {
    try {
      const response = await tripRequestService.updateStatus(
        id,
        newStatus
      );

      if (response.success) {
        toast.success('Trip status updated successfully!');
        fetchRequests();
      } else {
        toast.error(
          response.message || 'Failed to update status'
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        'Failed to update status'
      );
    }
  };

  const generateDefaultTemplate = (request: any) => {
    const destinationName = request.destination?.name || 'Destination';
    const userName = request.user
      ? `${request.user.firstName} ${request.user.lastName}`
      : 'Valued Traveler';
    const today = new Date().toLocaleDateString(undefined, { dateStyle: 'long' });
    const validUntil = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(undefined, { dateStyle: 'long' });

    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const dates = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    const duration = `${diffDays} Nights / ${diffDays + 1} Days`;
    const guests = `${request.travelerCount} Guest(s)`;

    return `WILDCONNECT
TRIP PROPOSAL

Your Wildlife Escape to ${destinationName}

Prepared for: ${userName}
Proposal Date: ${today}
Valid Until: ${validUntil}


TRIP OVERVIEW

Destination: ${destinationName}
Travel Dates: ${dates}
Duration: ${duration}
Guests: ${guests}


YOUR STAY

[ADMIN WILL EDIT]


YOUR SAFARI PLAN

[ADMIN WILL EDIT]


YOUR ITINERARY

[ADMIN WILL EDIT]


WHAT'S INCLUDED

[ADMIN WILL EDIT]


WHAT'S NOT INCLUDED

[ADMIN WILL EDIT]


PRICE SUMMARY

[ADMIN WILL EDIT]


PAYMENT SUMMARY

[ADMIN WILL EDIT]


IMPORTANT TO KNOW

[ADMIN WILL EDIT]


PROPOSAL VALIDITY

[ADMIN WILL EDIT]


WILDCONNECT

[CONTACT INFORMATION]`;
  };

  const handleOpenProposalModal = (request: any, defaultTab: 'write' | 'preview' = 'write') => {
    const existing = proposals.find((p) => p.tripRequestId === request.id);
    setActiveRequest(request);
    if (existing) {
      setActiveProposalText(existing.content || '');
    } else {
      setActiveProposalText(generateDefaultTemplate(request));
    }
    setActiveTab(defaultTab);
    setIsProposalModalOpen(true);
  };

  const handleSaveProposal = async () => {
    if (!activeRequest) return;
    setIsSaving(true);
    try {
      const existing = proposals.find((p) => p.tripRequestId === activeRequest.id);
      let response;
      if (existing) {
        response = await proposalService.update(existing.id, {
          content: activeProposalText,
        });
      } else {
        response = await proposalService.create({
          tripRequestId: activeRequest.id,
          content: activeProposalText,
        });
      }

      if (response.success) {
        toast.success(
          existing
            ? 'Proposal updated successfully!'
            : 'Proposal created successfully!'
        );
        setIsProposalModalOpen(false);
        fetchRequests();
      } else {
        toast.error(response.message || 'Failed to save proposal');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to save proposal'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendProposal = async () => {
    if (!activeRequest) return;
    if (!activeProposalText.trim()) {
      toast.error('Proposal content cannot be empty');
      return;
    }

    setIsSending(true);
    try {
      const existing = proposals.find((p) => p.tripRequestId === activeRequest.id);
      let proposalId = existing?.id;

      // Save content first
      if (existing) {
        await proposalService.update(existing.id, {
          content: activeProposalText,
        });
      } else {
        const createRes = await proposalService.create({
          tripRequestId: activeRequest.id,
          content: activeProposalText,
        });
        if (!createRes.success) {
          toast.error(createRes.message || 'Failed to save draft before sending');
          setIsSending(false);
          return;
        }
        proposalId = createRes.data.id;
      }

      // Send the proposal
      const sendRes = await proposalService.send(proposalId);
      if (sendRes.success) {
        toast.success('Proposal sent successfully!');
        setIsProposalModalOpen(false);
        fetchRequests();
      } else {
        toast.error(sendRes.message || 'Failed to send proposal');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to send proposal'
      );
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="admin-badge pending">
            Pending
          </span>
        );

      case 'REVIEWING':
        return (
          <span
            className="admin-badge warning"
            style={{
              backgroundColor: '#f3e8ff',
              color: '#6b21a8',
            }}
          >
            Reviewing
          </span>
        );

      case 'PROPOSAL_READY':
        return (
          <span className="admin-badge info">
            Proposal Ready
          </span>
        );

      case 'BOOKED':
        return (
          <span className="admin-badge success">
            Booked
          </span>
        );

      case 'CANCELLED':
        return (
          <span className="admin-badge danger">
            Cancelled
          </span>
        );

      default:
        return (
          <span className="admin-badge">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="admin-trip-requests-page">

      {/* ==================================================
          PAGE HEADER
          ================================================== */}

      <Link
        to="/admin"
        className="admin-trip-requests-back"
      >
        <ArrowLeft size={16} />
        Back to Admin Dashboard
      </Link>


      <div className="admin-trip-requests-header">

        <div>
          <span className="admin-trip-requests-eyebrow">
            WILDCONNECT ADMIN
          </span>

          <h1 className="admin-trip-requests-title">
            Trip Requests
          </h1>

          <p className="admin-trip-requests-subtitle">
            Review tourist requests and manage
            proposals and statuses.
          </p>
        </div>

        <div className="admin-trip-requests-count">
          <span>REQUESTS</span>
          <strong>
            {isLoading ? '...' : requests.length}
          </strong>
        </div>

      </div>


      {/* ==================================================
          CONTENT
          ================================================== */}

      {isLoading ? (

        <div className="admin-trip-requests-state">
          <div className="admin-trip-loading-spinner" />
          <p>Loading requests...</p>
        </div>

      ) : requests.length === 0 ? (

        <div className="admin-card admin-trip-requests-empty">

          <FileText
            size={42}
            className="admin-trip-empty-icon"
          />

          <h3>
            No Requests Found
          </h3>

          <p>
            Trip requests will appear here once
            travelers submit them.
          </p>

        </div>

      ) : (

        <div className="admin-trip-requests-list">

          {requests.map((request) => (

            <div
              key={request.id}
              className="admin-card admin-trip-request-card"
            >

              {/* ==========================================
                  CARD HEADER
                  ========================================== */}

              <div className="admin-trip-request-header">

                <div className="admin-trip-request-title-section">

                  <div className="admin-trip-request-title-row">

                    <h3 className="admin-trip-request-title">
                      Trip to{' '}
                      {request.destination?.name ||
                        'Unknown Destination'}
                    </h3>

                    {getStatusBadge(
                      request.status
                    )}

                  </div>

                  <p className="admin-trip-request-submitted-by">

                    Submitted by:{' '}

                    <span>
                      {request.user?.firstName}{' '}
                      {request.user?.lastName}
                    </span>

                    {request.user?.email && (
                      <>
                        {' '}
                        ({request.user.email})
                      </>
                    )}

                  </p>

                </div>


                {/* Status */}

                <div className="admin-trip-request-status-actions">

                  <label
                    className="admin-trip-request-status-label"
                  >
                    Update Status
                  </label>

                  <select
                    value={request.status}
                    onChange={(e) =>
                      handleStatusChange(
                        request.id,
                        e.target.value
                      )
                    }
                    className="admin-trip-request-select"
                    disabled={
                      request.status === 'CANCELLED'
                    }
                  >
                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="REVIEWING">
                      Reviewing
                    </option>

                    <option value="PROPOSAL_READY">
                      Proposal Ready
                    </option>

                    <option value="BOOKED">
                      Booked
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>
                  </select>

                </div>

              </div>


              {/* ==========================================
                  REQUEST INFORMATION
                  ========================================== */}

              <div className="admin-trip-request-grid">

                <div className="admin-trip-request-meta-item">

                  <Calendar size={16} />

                  <div>
                    <h4 className="admin-trip-request-meta-label">
                      Dates
                    </h4>

                    <p className="admin-trip-request-meta-value">
                      {new Date(
                        request.startDate
                      ).toLocaleDateString()}{' '}
                      -{' '}
                      {new Date(
                        request.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                </div>


                <div className="admin-trip-request-meta-item">

                  <Users size={16} />

                  <div>
                    <h4 className="admin-trip-request-meta-label">
                      Travelers
                    </h4>

                    <p className="admin-trip-request-meta-value">
                      {request.travelerCount}{' '}
                      {request.travelerCount === 1
                        ? 'person'
                        : 'people'}
                    </p>
                  </div>

                </div>


                <div className="admin-trip-request-meta-item">

                  <DollarSign size={16} />

                  <div>
                    <h4 className="admin-trip-request-meta-label">
                      Budget
                    </h4>

                    <p className="admin-trip-request-meta-value">
                      {request.budget ||
                        'Not specified'}
                    </p>
                  </div>

                </div>


                <div className="admin-trip-request-meta-item">

                  <MapPin size={16} />

                  <div>
                    <h4 className="admin-trip-request-meta-label">
                      Resort Preference
                    </h4>

                    <p className="admin-trip-request-meta-value">
                      {request.notes?.includes(
                        'Preferred Resort:'
                      )
                        ? request.notes.replace(
                          'Preferred Resort: ',
                          ''
                        )
                        : 'None'}
                    </p>
                  </div>

                </div>

              </div>


              {/* ==========================================
                  REQUIREMENTS
                  ========================================== */}

              {(request.preferences ||
                (request.notes &&
                  !request.notes.includes(
                    'Preferred Resort:'
                  ))) && (

                  <div className="admin-trip-request-requirements">

                    {request.preferences && (

                      <div className="admin-trip-request-req-item">

                        <MessageSquare size={15} />

                        <div>
                          <h4 className="admin-trip-request-req-label">
                            Special Requirements
                          </h4>

                          <p className="admin-trip-request-req-value">
                            {request.preferences}
                          </p>
                        </div>

                      </div>

                    )}


                    {request.notes &&
                      !request.notes.includes(
                        'Preferred Resort:'
                      ) && (

                        <div
                          className="admin-trip-request-req-item"
                          style={{
                            marginTop:
                              request.preferences
                                ? '0.65rem'
                                : 0,

                            paddingTop:
                              request.preferences
                                ? '0.65rem'
                                : 0,

                            borderTop:
                              request.preferences
                                ? '1px solid var(--color-border)'
                                : 'none',
                          }}
                        >

                          <ShieldAlert size={15} />

                          <div>

                            <h4 className="admin-trip-request-req-label">
                              Admin Notes
                            </h4>

                            <p className="admin-trip-request-req-value">
                              {request.notes}
                            </p>

                          </div>

                          </div>

                        )}

                  </div>

                )}

              {/* Proposal actions */}
              {request.status === 'PROPOSAL_READY' && (() => {
                const proposal = proposals.find((p) => p.tripRequestId === request.id);
                return (
                  <div className="admin-trip-request-proposal-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', alignItems: 'flex-end', width: '100%' }}>
                    {proposal && (
                      <div style={{ fontSize: '0.72rem', display: 'flex', gap: '0.35rem', color: '#55605a' }}>
                        <span>Proposal Status:</span>
                        <strong style={{
                          color: proposal.status === 'SENT' ? '#1e40af' :
                            proposal.status === 'DRAFT' ? '#6b7280' :
                            proposal.status === 'ACCEPTED' ? '#16a34a' :
                            proposal.status === 'CHANGE_REQUESTED' ? '#dc2626' :
                            'inherit'
                        }}>
                          {proposal.status}
                        </strong>
                        {proposal.sentAt && (
                          <span style={{ fontSize: '0.68rem', color: '#748079' }}>
                            (Sent on {new Date(proposal.sentAt).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {proposal && (
                        <button
                          onClick={() => handleOpenProposalModal(request, 'preview')}
                          className="admin-btn admin-btn-secondary"
                        >
                          View Proposal
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenProposalModal(request, 'write')}
                        className="admin-btn admin-btn-accent"
                      >
                        {proposal ? 'Edit Proposal' : 'Create Proposal'}
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>

          ))}

        </div>

      )}

      {/* Proposal Editor Modal */}
      {isProposalModalOpen && activeRequest && (
        <div className="modal-backdrop">
          <div className="modal-content proposal-modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">
                {proposals.some((p) => p.tripRequestId === activeRequest.id)
                  ? 'Edit Trip Proposal'
                  : 'Create Trip Proposal'}
              </h2>
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="proposal-tabs">
              <button
                onClick={() => setActiveTab('write')}
                className={`proposal-tab ${activeTab === 'write' ? 'active' : ''}`}
              >
                Write
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`proposal-tab ${activeTab === 'preview' ? 'active' : ''}`}
              >
                Preview
              </button>
            </div>

            {/* Modal Body */}
            <div className="proposal-editor-body">
              {activeTab === 'write' ? (
                <>
                  {/* Warning banner for requested changes */}
                  {(() => {
                    const proposal = proposals.find(p => p.tripRequestId === activeRequest.id);
                    return proposal?.status === 'CHANGE_REQUESTED' && proposal.changeRequest ? (
                      <div className="admin-proposal-change-request-alert">
                        <strong>Customer Requested Changes:</strong>
                        <p>"{proposal.changeRequest}"</p>
                      </div>
                    ) : null;
                  })()}

                  <textarea
                    value={activeProposalText}
                    onChange={(e) => setActiveProposalText(e.target.value)}
                    className="proposal-textarea"
                    placeholder="Write your proposal content here..."
                  />
                  {/* Recipient Details & Send Button */}
                  <div className="proposal-send-box">
                    <h4>Send to Particular User</h4>
                    <div className="proposal-send-recipient">
                      <span>Name: <strong>{activeRequest.user?.firstName} {activeRequest.user?.lastName}</strong></span>
                      <span>Email: <strong>{activeRequest.user?.email}</strong></span>
                    </div>
                    <div className="proposal-send-actions">
                      <button
                        onClick={handleSendProposal}
                        className="admin-btn admin-btn-accent"
                        disabled={isSaving || isSending}
                        style={{ height: '36px', padding: '0.45rem 1.25rem' }}
                      >
                        {isSending
                          ? 'Sending...'
                          : proposals.find(p => p.tripRequestId === activeRequest.id)?.status === 'CHANGE_REQUESTED'
                            ? 'Send Proposal Again'
                            : 'Send Proposal'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="proposal-preview-container">
                  <div className="proposal-document-sheet">
                    {activeProposalText}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="admin-btn admin-btn-secondary"
                disabled={isSaving || isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProposal}
                className="admin-btn admin-btn-accent"
                disabled={isSaving || isSending}
              >
                {isSaving
                  ? 'Saving...'
                  : proposals.find(p => p.tripRequestId === activeRequest.id)?.status === 'CHANGE_REQUESTED'
                    ? 'Save Changes'
                    : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTripRequests;