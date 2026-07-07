const cloudinary = require('cloudinary').v2;
const { MESSAGES } = require('./upload.constants');

class StorageService {
  async uploadFile(_fileBuffer, _options = {}) {
    throw new Error('uploadFile must be implemented by subclass');
  }

  async deleteFile(_storageKey) {
    throw new Error('deleteFile must be implemented by subclass');
  }

  async getFileUrl(_storageKey) {
    throw new Error('getFileUrl must be implemented by subclass');
  }

  async streamFile(_storageKey) {
    throw new Error('streamFile must be implemented by subclass');
  }
}

class CloudinaryStorageService extends StorageService {
  constructor() {
    super();
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(MESSAGES.STORAGE_NOT_CONFIGURED);
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(fileBuffer, options = {}) {
    const { folder = 'disha/contributions', resourceType = 'auto', publicId } = options;

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            // eslint-disable-next-line no-console
            console.error('[ContributionUpload] Cloudinary upload failed:', error.message);
            return reject(new Error(MESSAGES.UPLOAD_FAILED));
          }
          return resolve({
            storageKey: result.public_id,
            publicUrl: result.secure_url,
            size: result.bytes,
            format: result.format,
            resourceType: result.resource_type,
          });
        }
      );
      stream.end(fileBuffer);
    });
  }

  async deleteFile(storageKey) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(storageKey, { resource_type: 'auto' }, (error, result) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[ContributionUpload] Cloudinary delete failed:', error.message);
          return reject(new Error(MESSAGES.DELETE_FAILED));
        }
        return resolve(result.result === 'ok');
      });
    });
  }

  async getFileUrl(storageKey) {
    return cloudinary.url(storageKey, { secure: true });
  }

  async streamFile(storageKey) {
    return this.getFileUrl(storageKey);
  }
}

const storageService = new CloudinaryStorageService();

module.exports = {
  StorageService,
  CloudinaryStorageService,
  storageService,
};
