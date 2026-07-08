const mongoose = require('mongoose');

const rewardCatalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Reward name is required'],
      trim: true,
      maxlength: [200, 'Reward name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Disha Merchandise',
        'Scholarships',
        'TalentGrow Coupons',
        'Learning Resources',
        'Certificates',
        'Partner Benefits',
        'Limited Time Rewards',
        'Digital Rewards',
        'Other',
      ],
      index: true,
    },
    coinCost: {
      type: Number,
      required: [true, 'Coin cost is required'],
      min: [1, 'Coin cost must be at least 1'],
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    popularity: {
      type: Number,
      min: [0, 'Popularity cannot be negative'],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    eligibility: {
      type: String,
      trim: true,
      maxlength: [1000, 'Eligibility cannot exceed 1000 characters'],
      default: '',
    },
    termsAndConditions: {
      type: String,
      trim: true,
      maxlength: [2000, 'Terms and conditions cannot exceed 2000 characters'],
      default: '',
    },
    estimatedDelivery: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'sold_out'],
      default: 'active',
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

rewardCatalogSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

rewardCatalogSchema.index({ category: 1, status: 1 });
rewardCatalogSchema.index({ isFeatured: -1, popularity: -1 });
rewardCatalogSchema.index({ coinCost: 1 });

const RewardCatalog = mongoose.model('RewardCatalog', rewardCatalogSchema);

module.exports = RewardCatalog;
