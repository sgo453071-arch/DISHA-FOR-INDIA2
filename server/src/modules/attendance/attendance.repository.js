const Attendance = require('./attendance.model');

class AttendanceRepository {
  /**
   * Create a new attendance record.
   */
  async create(attendanceData) {
    return Attendance.create(attendanceData);
  }

  /**
   * Find an attendance record by its MongoDB ID.
   */
  async findById(id) {
    return Attendance.findById(id);
  }

  /**
   * Find an attendance record by its custom attendanceId.
   */
  async findByAttendanceId(attendanceId) {
    return Attendance.findOne({ attendanceId });
  }

  /**
   * Find attendance records by application ID.
   */
  async findByApplication(applicationId) {
    return Attendance.find({ application: applicationId });
  }

  /**
   * Find attendance records by program ID.
   */
  async findByProgram(programId) {
    return Attendance.find({ program: programId });
  }

  /**
   * Find attendance records by volunteer ID.
   */
  async findByVolunteer(userId) {
    return Attendance.find({ user: userId });
  }

  /**
   * Find attendance records by date.
   */
  async findByDate(date) {
    return Attendance.find({ attendanceDate: date });
  }

  /**
   * Update an attendance record.
   */
  async update(id, updateData) {
    return Attendance.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  /**
   * Soft delete an attendance record.
   */
  async softDelete(id, deletedById) {
    return Attendance.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedById,
      },
      { new: true }
    );
  }
}

module.exports = new AttendanceRepository();
