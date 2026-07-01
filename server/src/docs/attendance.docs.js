/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Volunteer Attendance Management
 *
 * /api/v1/attendance/check-in:
 *   post:
 *     summary: Check in for a program (Skeleton)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Check-in skeleton response
 *
 * /api/v1/attendance/check-out:
 *   patch:
 *     summary: Check out from a program (Skeleton)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Check-out skeleton response
 *
 * /api/v1/attendance/me:
 *   get:
 *     summary: Get my attendance (Skeleton)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: My attendance skeleton response
 *
 * /api/v1/attendance/history:
 *   get:
 *     summary: Get overall attendance history (Admin/Coordinator Only) (Skeleton)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance history skeleton response
 *
 * /api/v1/attendance/{id}:
 *   get:
 *     summary: Get details of a specific attendance record (Skeleton)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance detail skeleton response
 *   patch:
 *     summary: Manually mark attendance (Admin/Coordinator Only) (Skeleton)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mark attendance skeleton response
 */
