/**
 * @swagger
 * tags:
 *   - name: Certificates
 *     description: Volunteer Certificate Generation & Verification
 *
 * /api/v1/certificates/generate:
 *   post:
 *     summary: Generate Certificate (Volunteer)
 *     description: Generate a certificate for a completed program. Attendance criteria must be met.
 *     tags: [Certificates]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - programId
 *             properties:
 *               programId:
 *                 type: string
 *                 description: MongoDB ID of the completed program
 *                 example: 665f1b2c3d4e5f6789abcdef
 *               applicationId:
 *                 type: string
 *                 description: MongoDB ID of the application
 *                 example: 665f1b2c3d4e5f6789abcdef
 *               attendanceId:
 *                 type: string
 *                 description: MongoDB ID of the attendance record
 *                 example: 665f1b2c3d4e5f6789abcdef
 *               volunteerHours:
 *                 type: number
 *                 description: Override volunteer hours
 *                 example: 40
 *     responses:
 *       201:
 *         description: Certificate generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Certificate generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     certificateId:
 *                       type: string
 *                       example: CERT-20260101-A1B2C3
 *                     certificateNumber:
 *                       type: string
 *                       example: DISHA-CERT-2026-000001
 *                     certificateUrl:
 *                       type: string
 *                       example: https://res.cloudinary.com/disha/image/upload/v1/certificates/cert.pdf
 *                     verificationUrl:
 *                       type: string
 *                       example: http://localhost:5000/api/v1/certificates/verify/DISHA-CERT-2026-000001
 *                     qrCode:
 *                       type: string
 *                     volunteerHours:
 *                       type: number
 *                       example: 40
 *                     issuedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation failed - program not completed or attendance criteria not met.
 *       409:
 *         description: Certificate already exists for this program.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/certificates/admin/auto-generate/{programId}:
 *   post:
 *     summary: Auto-Generate Certificates for Completed Program (Admin)
 *     description: Admin-only endpoint to automatically generate certificates for all eligible volunteers in a completed program.
 *     tags: [Certificates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Auto-generation completed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Auto-generation completed
 *                 data:
 *                   type: object
 *                   properties:
 *                     generated:
 *                       type: integer
 *                     skipped:
 *                       type: integer
 *                     failed:
 *                       type: array
 *       404:
 *         description: Program not found or not completed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Admin access required.
 *
 * /api/v1/certificates/verify/{certificateNumber}:
 *   get:
 *     summary: Verify Certificate by Number (Public)
 *     description: Public endpoint to verify authenticity of a certificate using its unique number.
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certificateNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: DISHA-CERT-2026-000001
 *     responses:
 *       200:
 *         description: Certificate verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Certificate verified successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     verified:
 *                       type: boolean
 *                       example: true
 *                     status:
 *                       type: string
 *                       example: issued
 *                     isRevoked:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: Certificate is valid
 *                     certificate:
 *                       type: object
 *       404:
 *         description: Certificate not found or invalid.
 *
 * /api/v1/certificates/{id}/download:
 *   get:
 *     summary: Download Certificate PDF
 *     description: Download the certificate PDF. Only the certificate owner or an admin can download.
 *     tags: [Certificates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Certificate PDF returned.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Forbidden - Only owner or admin can download.
 *       404:
 *         description: Certificate not found.
 *
 * /api/v1/certificates/admin/{id}/revoke:
 *   post:
 *     summary: Revoke Certificate (Admin)
 *     description: Admin-only endpoint to revoke a certificate.
 *     tags: [Certificates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Certificate revoked successfully.
 *       404:
 *         description: Certificate not found.
 *       403:
 *         description: Forbidden - Admin access required.
 */
