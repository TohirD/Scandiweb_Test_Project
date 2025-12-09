import React, { useState } from 'react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const safeIndex = Math.min(Math.max(index, 0), images.length - 1);

  const goPrev = () => setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const goNext = () =>
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));

  return (
    <div className="gallery" data-testid="product-gallery">
      <div className="gallery-thumbs">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className={`gallery-thumb ${i === safeIndex ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          >
            <img src={src} alt={`thumb-${i}`} />
          </button>
        ))}
      </div>

      <div className="gallery-main">
        <img src={images[safeIndex]} alt={`main-${safeIndex}`} />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-left"
              onClick={goPrev}
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-right"
              onClick={goNext}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
