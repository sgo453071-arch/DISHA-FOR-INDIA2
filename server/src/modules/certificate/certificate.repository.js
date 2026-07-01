const Certificate = require('./certificate.model');

class CertificateRepository {
  async create(certData) {
    return Certificate.create(certData);
  }

  async findById(id) {
    return Certificate.findOne({ _id: id, isDeleted: false })
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId')
      .populate('application')
      .populate('attendance')
      .populate('issuedBy', 'name email');
  }

  async findByCertificateNumber(certificateNumber) {
    return Certificate.findOne({ certificateNumber, isDeleted: false })
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId')
      .populate('application')
      .populate('attendance')
      .populate('issuedBy', 'name email');
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      Certificate.find({ user: userId, isDeleted: false })
        .sort({ issuedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('program', 'title programId')
        .lean(),
      Certificate.countDocuments({ user: userId, isDeleted: false }),
    ]);

    return { certificates, total, page, limit };
  }

  async findCertificateToGenerate(userId, programId) {
    return Certificate.findOne({ user: userId, program: programId, isDeleted: false }).lean();
  }

  async findByUserAndProgram(userId, programId) {
    return Certificate.findOne({ user: userId, program: programId, isDeleted: false });
  }

  async findCertificatesByProgram(programId) {
    return Certificate.find({ program: programId, isDeleted: false })
      .populate('user', 'name email volunteerId')
      .lean();
  }

  async update(id, updateData) {
    return Certificate.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async revoke(id) {
    return Certificate.findByIdAndUpdate(
      id,
      { status: 'revoked' },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id, deletedById) {
    return Certificate.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedById },
      { new: true }
    );
  }
}

module.exports = new CertificateRepository();
