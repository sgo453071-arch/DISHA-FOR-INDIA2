const RewardCatalog = require('./rewardCatalog.model');

class RewardCatalogRepository {
  async create(catalogData) {
    return RewardCatalog.create(catalogData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 20, sort = '-createdAt' } = options;
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.category && filters.category !== 'All') {
      query.category = filters.category;
    }
    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = { $ne: 'inactive' };
    }
    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters.minCoins !== undefined || filters.maxCoins !== undefined) {
      query.coinCost = {};
      if (filters.minCoins !== undefined) query.coinCost.$gte = filters.minCoins;
      if (filters.maxCoins !== undefined) query.coinCost.$lte = filters.maxCoins;
    }
    if (filters.inStock !== undefined && filters.inStock) {
      query.stock = { $gt: 0 };
    }

    const [items, total] = await Promise.all([
      RewardCatalog.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      RewardCatalog.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  async findById(id) {
    return RewardCatalog.findById(id).lean();
  }

  async findFeatured(limit = 10) {
    return RewardCatalog.find({ isFeatured: true, status: 'active', stock: { $gt: 0 } })
      .sort({ popularity: -1, createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async updateStock(id, quantity) {
    return RewardCatalog.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true, runValidators: true }
    ).lean();
  }

  async findByIdAndUpdate(id, updateData) {
    return RewardCatalog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async incrementPopularity(id) {
    return RewardCatalog.findByIdAndUpdate(
      id,
      { $inc: { popularity: 1 } },
      { new: true }
    ).lean();
  }
}

module.exports = new RewardCatalogRepository();
