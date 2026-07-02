const mongoose = require('mongoose');
const { CERTIFICATE_STATUS } = require('./certificate.constants');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true, required: true, trim: true },
    certificateNumber: { type: String, unique: true, required: true, trim: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', default: null },
    attendance: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance', default: null },

    certificateUrl: { type: String, trim: true, default: null },
    verificationUrl: { type: String, trim: true, default: null },
    qrCode: { type: String, trim: true, default: null },

    volunteerHours: { type: Number, required: true, min: [0, 'Volunteer hours cannot be negative'] },
    organization: { type: String, required: true, trim: true, default: 'Disha for India' },
    authorizedSignatory: { type: String, required: true, trim: true },

    status: { type: String, enum: Object.values(CERTIFICATE_STATUS), default: CERTIFICATE_STATUS.ISSUED, index: true },
    issuedAt: { type: Date, default: Date.now },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// Compound indexes
certificateSchema.index({ user: 1, program: 1 });
certificateSchema.index({ user: 1, issuedAt: -1 });
certificateSchema.index({ program: 1, status: 1 });

// JSON transform (strip __v)
certificateSchema.set('toJSON', {
  transform: function (doc, ret) { delete ret.__v; return ret; }
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
