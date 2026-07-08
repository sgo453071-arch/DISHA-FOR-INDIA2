import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Coins, Minus, Plus } from 'lucide-react';

const RedeemModal = ({ open, onClose, reward, userCoins, onConfirm, loading = false }) => {
  const [quantity, setQuantity] = useState(1);

  if (!reward) return null;

  const totalCost = reward.coinCost * quantity;
  const canAfford = userCoins >= totalCost;
  const exceedsStock = quantity > reward.stock;

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= reward.stock) {
      setQuantity(newQty);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'relative',
              background: 'var(--color-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: '440px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              zIndex: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Confirm Redemption</h3>
              <button
                onClick={onClose}
                aria-label="Close modal"
                disabled={loading}
                style={{ background: 'none', border: 'none', color: 'var(--color-body)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    background: reward.image ? `url(${reward.image}) center/cover no-repeat` : 'linear-gradient(135deg, #F8F7F4, #EDE9FE)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 0.25rem 0' }}>{reward.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', fontWeight: 500 }}>{reward.category}</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
                    {reward.coinCost.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>coins each</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-heading)' }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || loading}
                    aria-label="Decrease quantity"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-card)',
                      color: 'var(--color-heading)',
                      cursor: quantity <= 1 || loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= reward.stock || loading}
                    aria-label="Increase quantity"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-card)',
                      color: 'var(--color-heading)',
                      cursor: quantity >= reward.stock || loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ background: '#FDFBF7', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid #F0EDE8', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-body)' }}>Your Balance</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-heading)' }}>{userCoins.toLocaleString()} coins</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-body)' }}>Total Cost</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-heading)' }}>{totalCost.toLocaleString()} coins</span>
                </div>
                <div style={{ height: 1, background: '#F0EDE8', margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-heading)' }}>Remaining</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: canAfford ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {(userCoins - totalCost).toLocaleString()} coins
                  </span>
                </div>
              </div>

              {!canAfford && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1rem' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-error)', fontWeight: 600 }}>Insufficient coins. You need {(totalCost - userCoins).toLocaleString()} more coins.</span>
                </div>
              )}

              {exceedsStock && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '1rem' }}>
                  <AlertTriangle size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 600 }}>Only {reward.stock} items available.</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-heading)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading || !canAfford || exceedsStock}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: loading || !canAfford || exceedsStock ? '#D1D5DB' : 'var(--color-primary)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: loading || !canAfford || exceedsStock ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins size={18} />
                      Confirm Redemption
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RedeemModal;
