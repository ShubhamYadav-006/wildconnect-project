/* ==========================================================
   Partner Finances & Payouts Component
   ========================================================== */

import { useState, useEffect } from 'react';
import { payoutService, PayoutOverview } from '../../../services/payout.service';
import '../../../styles/partner/PartnerFinances.css';

export const PartnerFinances = () => {
  const [finances, setFinances] = useState<PayoutOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    try {
      setIsLoading(true);
      const res = await payoutService.getMyFinances();
      setFinances(res.data);
    } catch (err) {
      console.error('Failed to fetch partner finances:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="partner-finances-container"><p>Loading earnings and payout balances...</p></div>;
  }

  return (
    <div className="partner-finances-container">
      <div className="finances-header">
        <h1 className="finances-title">Earnings & Payout Ledger</h1>
        <p className="finances-subtitle">
          Track escrow deposits, platform commission deductions, and automated T+24h bank settlement disbursements.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="finances-kpi-grid">
        <div className="finance-kpi-card">
          <div className="finance-kpi-label">Gross Bookings Volume</div>
          <div className="finance-kpi-value">₹{finances?.grossEarnings.toLocaleString('en-IN') || 0}</div>
        </div>

        <div className="finance-kpi-card">
          <div className="finance-kpi-label">Platform Service Fees (10%)</div>
          <div className="finance-kpi-value">₹{finances?.totalPlatformFees.toLocaleString('en-IN') || 0}</div>
        </div>

        <div className="finance-kpi-card">
          <div className="finance-kpi-label">Funds Held in Escrow</div>
          <div className="finance-kpi-value escrow">₹{finances?.inEscrowBalance.toLocaleString('en-IN') || 0}</div>
        </div>

        <div className="finance-kpi-card">
          <div className="finance-kpi-label">Net Disbursed to Bank</div>
          <div className="finance-kpi-value paid">₹{finances?.netPayoutBalance.toLocaleString('en-IN') || 0}</div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="finances-table-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F4D3A', marginBottom: '1rem' }}>Payout Settlement Ledger</h2>

        <table className="finances-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Property / Business</th>
              <th>Guest Name</th>
              <th>Gross Booking</th>
              <th>Platform Fee</th>
              <th>Net Payout</th>
              <th>Status</th>
              <th>Settlement Info</th>
            </tr>
          </thead>
          <tbody>
            {finances?.payouts?.map((p) => (
              <tr key={p.id}>
                <td><strong>#{p.bookingId.slice(0, 8)}</strong></td>
                <td>{p.business?.name}</td>
                <td>{p.booking?.guestName}</td>
                <td>₹{p.grossAmount.toLocaleString('en-IN')}</td>
                <td style={{ color: '#B94A48' }}>-₹{p.platformFee.toLocaleString('en-IN')}</td>
                <td><strong>₹{p.netPayout.toLocaleString('en-IN')}</strong></td>
                <td>
                  <span className={`payout-status-tag ${p.status === 'PAID' ? 'paid' : 'escrow'}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', color: '#6F7B73' }}>
                  {p.utrNumber ? `UTR: ${p.utrNumber}` : 'Clears T+24h post check-in'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!finances?.payouts || finances.payouts.length === 0) && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6F7B73' }}>
            No payout transactions yet. Confirmed guest bookings will automatically appear here.
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerFinances;
