import { describe, expect, it } from 'vitest';
import { MAX_IMAGE_UPLOAD_SIZE, validateImageFile } from './imageUploads';

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
    expect(() => validateImageFile(createFile('document.pdf', 'application/pdf'))).toThrow(
      'Bitte wählen Sie ein Bild im Format JPG, PNG, WebP oder GIF aus.',
    );
  });

  it('rejects unsupported MIME types even when the file extension looks like an image', () => {
    expect(() => validateImageFile(createFile('renamed.jpg', 'application/pdf'))).toThrow(
      'Bitte wählen Sie ein Bild im Format JPG, PNG, WebP oder GIF aus.',
    );
  });

  it('rejects files larger than 5 MB', () => {
    expect(() => validateImageFile(createFile('large.jpg', 'image/jpeg', MAX_IMAGE_UPLOAD_SIZE + 1))).toThrow(
      'Das Bild ist zu groß. Bitte wählen Sie ein Bild mit maximal 5 MB aus.',
    );
  });
});
