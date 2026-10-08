import { describe, expect, it } from 'vitest';
import { ImageValidationError, MAX_IMAGE_UPLOAD_SIZE, validateImageFile } from './imageUploads';

function createFile(name: string, type: string, size = 1024) {
  return new File([new Uint8Array(size)], name, { type });
}

describe('image upload validation', () => {
  it('accepts JPG images', () => {
    expect(() => validateImageFile(createFile('review.jpg', 'image/jpeg'))).not.toThrow();
  });

  it('accepts PNG images', () => {
    expect(() => validateImageFile(createFile('review.png', 'image/png'))).not.toThrow();
  });

  it('accepts WebP images', () => {
    expect(() => validateImageFile(createFile('review.webp', 'image/webp'))).not.toThrow();
  });

  it('accepts mobile images when the browser omits the MIME type but keeps a valid extension', () => {
    expect(() => validateImageFile(createFile('mobile-photo.jpeg', ''))).not.toThrow();
  });

  it('rejects unsupported file types', () => {
    try {
      validateImageFile(createFile('document.pdf', 'application/pdf'));
      throw new Error('Expected unsupported file type to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(ImageValidationError);
      expect((error as ImageValidationError).translationKey).toBe('image_upload_invalid_type');
    }
  });

  it('rejects unsupported MIME types even when the file extension looks like an image', () => {
    expect(() => validateImageFile(createFile('renamed.jpg', 'application/pdf'))).toThrow(ImageValidationError);
  });

  it('rejects files larger than 5 MB', () => {
    try {
      validateImageFile(createFile('large.jpg', 'image/jpeg', MAX_IMAGE_UPLOAD_SIZE + 1));
      throw new Error('Expected oversized image to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(ImageValidationError);
      expect((error as ImageValidationError).translationKey).toBe('image_upload_too_large');
    }
  });
});
