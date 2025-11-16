import { useEffect } from 'react';

const ImageLightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNavigate]);

  if (!images || images.length === 0) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center'>
      {/* Close Button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10'
        aria-label='Close lightbox'
      >
        ×
      </button>

      {/* Image Counter */}
      <div className='absolute top-4 left-4 text-white text-lg z-10'>
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={() => onNavigate('prev')}
          className='absolute left-4 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-gray-300 z-10'
          aria-label='Previous image'
        >
          ‹
        </button>
      )}

      {/* Current Image */}
      <div className='max-w-7xl max-h-[90vh] flex items-center justify-center'>
        <img
          src={images[currentIndex]?.url}
          alt={`Room image ${currentIndex + 1}`}
          className='max-w-full max-h-[90vh] object-contain'
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={() => onNavigate('next')}
          className='absolute right-4 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-gray-300 z-10'
          aria-label='Next image'
        >
          ›
        </button>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black bg-opacity-50 rounded-lg'>
          {images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => onNavigate(index)}
              className={`w-16 h-16 object-cover cursor-pointer rounded border-2 ${
                index === currentIndex ? 'border-white' : 'border-transparent'
              } hover:border-gray-400 transition-all`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
