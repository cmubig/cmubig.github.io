import React, { useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const Carousel = ({ images, autoSlideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const autoSlideTimeout = useRef(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    )
  }

  const handleImageClick = () => {
    setIsZoomed(true)
  }

  const closeZoom = () => {
    setIsZoomed(false)
  }

  const handleZoomAreaClick = (e) => {
    if (e.target === e.currentTarget) {
      closeZoom()
    }
  }

  // Auto slide
  useEffect(() => {
    autoSlideTimeout.current = setTimeout(nextSlide, autoSlideInterval)
    return () => clearTimeout(autoSlideTimeout.current)
  }, [currentIndex, autoSlideInterval])

  // Handle mouse gestures
  const handleMouseDown = (e) => {
    const startX = e.pageX
    const handleMouseUp = (upEvent) => {
      const endX = upEvent.pageX
      if (startX > endX + 50) {
        nextSlide()
      } else if (startX < endX - 50) {
        prevSlide()
      }
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mouseup', handleMouseUp)
  }

  // Handle touch gestures
  const handleTouchStart = (e) => {
    const startX = e.touches[0].clientX
    const handleTouchEnd = (endEvent) => {
      const endX = endEvent.changedTouches[0].clientX
      if (startX > endX + 50) {
        nextSlide()
      } else if (startX < endX - 50) {
        prevSlide()
      }
      window.removeEventListener('touchend', handleTouchEnd)
    }
    window.addEventListener('touchend', handleTouchEnd)
  }

  return (
    <div
      className="relative w-full max-w-5xl mx-auto group"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="overflow-hidden rounded-lg shadow-lg relative">
        <div className="relative h-80 sm:h-80 md:h-96">
          {images.map((image, index) => (
            <Transition
              key={index}
              show={index === currentIndex}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              as="div"
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover cursor-pointer aspect-auto"
                onClick={handleImageClick}
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white text-sm p-2">
                  {image.caption}
                </div>
              )}
            </Transition>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-black bg-opacity-50 group-hover:bg-opacity-75 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          aria-label="Previous slide"
        >
          <IoIosArrowBack className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-black bg-opacity-50 group-hover:bg-opacity-75 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          aria-label="Next slide"
        >
          <IoIosArrowForward className="h-6 w-6" />
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 group-hover:opacity-100 transition-opacity opacity-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              index === currentIndex ? 'bg-brand-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleZoomAreaClick}
        >
          <div className="relative max-w-screen-xl max-h-screen-90 overflow-hidden">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close fullscreen view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carousel
