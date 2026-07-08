import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import marketplaceService from '../../services/marketplaceService';
import { getMyRewards } from '../../services/gamificationService';
import MarketplaceHero from '../../components/marketplace/MarketplaceHero';
import WalletSummary from '../../components/marketplace/WalletSummary';
import RewardCategoryTabs from '../../components/marketplace/RewardCategoryTabs';
import RewardSearch from '../../components/marketplace/RewardSearch';
import RewardFilters from '../../components/marketplace/RewardFilters';
import RewardGrid from '../../components/marketplace/RewardGrid';
import RewardDetailDrawer from '../../components/marketplace/RewardDetailDrawer';
import RedemptionHistory from '../../components/marketplace/RedemptionHistory';
import EmptyState from '../../components/marketplace/EmptyState';
import SkeletonLoader from '../../components/marketplace/SkeletonLoader';
import RedeemModal from '../../components/marketplace/RedeemModal';

const CATEGORIES = [
  'All',
  'Disha Merchandise',
  'Scholarships',
  'TalentGrow Coupons',
  'Learning Resources',
  'Certificates',
  'Partner Benefits',
  'Limited Time Rewards',
  'Digital Rewards',
  'Other',
];

const SORT_OPTIONS = {
  newest: { field: 'createdAt', order: -1 },
  popular: { field: 'popularity', order: -1 },
  lowest: { field: 'coinCost', order: 1 },
  highest: { field: 'coinCost', order: -1 },
};

const Marketplace = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [coinRange, setCoinRange] = useState('all');
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemTarget, setRedeemTarget] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const { data: rewardsData, isLoading: rewardsLoading, error: rewardsError } = useQuery({
    queryKey: ['marketplace-catalog', selectedCategory, searchQuery, sortBy, inStockOnly, coinRange],
    queryFn: async () => {
      const params = {
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sort: sortBy,
        inStock: inStockOnly || undefined,
        page: 1,
        limit: 24,
      };
      if (coinRange !== 'all') {
        if (coinRange === '0-500') { params.minCoins = 0; params.maxCoins = 500; }
        else if (coinRange === '500-1000') { params.minCoins = 500; params.maxCoins = 1000; }
        else if (coinRange === '1000-5000') { params.minCoins = 1000; params.maxCoins = 5000; }
        else if (coinRange === '5000+') { params.minCoins = 5000; }
      }
      const res = await marketplaceService.getMarketplaceCatalog(params);
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !showHistory,
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-rewards'],
    queryFn: async () => {
      const res = await marketplaceService.getFeaturedRewards(6);
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !showHistory,
  });

  const { data: userRewards, isLoading: userRewardsLoading } = useQuery({
    queryKey: ['my-rewards'],
    queryFn: async () => {
      const res = await getMyRewards();
      if (res?.success) return res.data;
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['redemption-history'],
    queryFn: async () => {
      const res = await marketplaceService.getRedemptionHistory({ page: 1, limit: 20 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: showHistory,
  });

  const rewards = rewardsData?.items || [];
  const totalRewards = rewardsData?.total || 0;
  const userCoins = userRewards?.currentCoins ?? 0;
  const featuredRewards = featuredData || [];

  const handleViewDetails = (reward) => {
    setSelectedReward(reward._id || reward.id);
  };

  const handleRedeem = (reward) => {
    setRedeemTarget(reward);
  };

  const handleRedeemSuccess = () => {
    setRedeemTarget(null);
    setSelectedReward(null);
    queryClient.invalidateQueries(['my-rewards']);
    queryClient.invalidateQueries(['marketplace-catalog']);
    toast.success('Redemption successful!');
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('newest');
    setInStockOnly(false);
    setCoinRange('all');
  };

  const isLoading = rewardsLoading && !rewardsData;

   return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', fontFamily: 'var(--font-primary)', padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem) 3rem' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <MarketplaceHero coins={userCoins} level={userRewards?.level || 'Beginner'} onBrowse={() => {}} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <WalletSummary rewards={userRewards} history={historyData} loading={userRewardsLoading} />
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 0.75rem 0' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: !showHistory ? 'rgba(37,99,235,0.06)' : 'transparent',
                    color: !showHistory ? 'var(--color-primary)' : 'var(--color-heading)',
                    fontSize: '0.875rem',
                    fontWeight: !showHistory ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <Sparkles size={16} />
                  Browse Rewards
                </button>
                <button
                  onClick={() => setShowHistory(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: showHistory ? 'rgba(37,99,235,0.06)' : 'transparent',
                    color: showHistory ? 'var(--color-primary)' : 'var(--color-heading)',
                    fontSize: '0.875rem',
                    fontWeight: showHistory ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <History size={16} />
                  My Redemptions
                </button>
              </div>
            </div>
          </div>

          <div>
            {!showHistory ? (
              <>
                {featuredRewards.length > 0 && !searchQuery && selectedCategory === 'All' && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '1rem' }}>
                      Featured Rewards
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                      {featuredRewards.map((reward) => (
                        <div
                          key={reward._id}
                          onClick={() => handleViewDetails(reward)}
                          style={{
                            background: 'var(--color-card)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '120px',
                              background: reward.image ? `url(${reward.image}) center/cover no-repeat` : 'linear-gradient(135deg, #F8F7F4, #EDE9FE)',
                            }}
                          />
                          <div style={{ padding: '0.75rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 0.25rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {reward.name}
                            </h4>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                              {reward.coinCost.toLocaleString()} coins
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-heading)', margin: 0 }}>
                      All Rewards
                      {totalRewards > 0 && <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-body)', marginLeft: '0.5rem' }}>({totalRewards})</span>}
                    </h2>
                    <RewardFilters
                      categories={CATEGORIES}
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      inStockOnly={inStockOnly}
                      onInStockChange={setInStockOnly}
                      coinRange={coinRange}
                      onCoinRangeChange={setCoinRange}
                    />
                  </div>
                  <RewardSearch value={searchQuery} onChange={setSearchQuery} />
                  <RewardCategoryTabs categories={CATEGORIES} selected={selectedCategory} onChange={setSelectedCategory} />
                </div>

                {isLoading ? (
                  <SkeletonLoader type="grid" count={8} />
                ) : rewardsError ? (
                  <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <p style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>Failed to load rewards. Please check your connection and try again.</p>
                    <button onClick={() => queryClient.invalidateQueries(['marketplace-catalog'])} className="btn btn-primary">
                      Retry
                    </button>
                  </div>
                ) : rewards.length === 0 ? (
                  <EmptyState type="rewards" onAction={resetFilters} actionLabel="Clear Filters" />
                ) : (
                  <RewardGrid
                    rewards={rewards}
                    onViewDetails={handleViewDetails}
                    onRedeem={handleRedeem}
                    userCoins={userCoins}
                  />
                )}
              </>
            ) : (
              <RedemptionHistory history={historyData} loading={historyLoading} />
            )}
          </div>
        </div>
      </div>

      <RewardDetailDrawer
        rewardId={selectedReward}
        onClose={() => setSelectedReward(null)}
        userCoins={userCoins}
        onRedeemSuccess={handleRedeemSuccess}
      />

      <RedeemModal
        open={!!redeemTarget}
        onClose={() => setRedeemTarget(null)}
        reward={redeemTarget}
        userCoins={userCoins}
        onConfirm={handleRedeemSuccess}
      />
    </div>
  );
};

export default Marketplace;
