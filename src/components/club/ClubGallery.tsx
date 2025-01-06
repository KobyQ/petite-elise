"use client";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/modal";
import { Button } from "../ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Card, CardContent } from "../ui/card";

type ImageItem = {
  id: number;
  src: string;
  alt: string;
};

const photos: ImageItem[] = [
  {
    id: 1,
    src: "https://media.istockphoto.com/id/1348468327/photo/little-african-american-boy-building-a-small-house-with-colorful-wooden-blocks-in-living-room.jpg?s=612x612&w=0&k=20&c=ZpvXvZhMd_KnnzJFYiqTQPY3UcFCvrpwMskxfxaCw5c=",
    alt: "Club Image 1",
  },
  {
    id: 2,
    src: "https://thumbs.dreamstime.com/b/black-family-high-five-building-blocks-daughter-learning-mother-floor-living-room-kid-growth-toys-child-336619007.jpg",
    alt: "Club Image 2",
  },
  {
    id: 3,
    src: "https://media.istockphoto.com/id/1348468327/photo/little-african-american-boy-building-a-small-house-with-colorful-wooden-blocks-in-living-room.jpg?s=612x612&w=0&k=20&c=ZpvXvZhMd_KnnzJFYiqTQPY3UcFCvrpwMskxfxaCw5c=",
    alt: "Club Image 3",
  },
  {
    id: 4,
    src: "https://thumbs.dreamstime.com/b/black-family-high-five-building-blocks-daughter-learning-mother-floor-living-room-kid-growth-toys-child-336619007.jpg",
    alt: "Club Image 4",
  },
  {
    id: 5,
    src: "https://thumbs.dreamstime.com/b/black-family-high-five-building-blocks-daughter-learning-mother-floor-living-room-kid-growth-toys-child-336619007.jpg",
    alt: "Club Image 5",
  },
  {
    id: 6,
    src: "https://thumbs.dreamstime.com/b/black-family-high-five-building-blocks-daughter-learning-mother-floor-living-room-kid-growth-toys-child-336619007.jpg",
    alt: "Club Image 6",
  },
];

const ClubGallery = () => {
    const [isOpen, setIsOpen] = useState(false)
     const [currentIndex, setCurrentIndex] = useState(0)
   
     const showNext = () => {
       setCurrentIndex((current) => (current + 1) % photos.length)
     }
   
     const showPrevious = () => {
       setCurrentIndex((current) => (current - 1 + photos.length) % photos.length)
     }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-8">
          Our Club Gallery
        </h2>

        {/* Grid Layout */}
        <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <Card 
          key={index} 
          className="group cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => {
            setCurrentIndex(index)
            setIsOpen(true)
          }}
        >
          <CardContent className="p-2">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={400}
                height={300}
                className="transform transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            fill
            className="object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              showPrevious()
            }}
          >
            <LuChevronLeft className="h-8 w-8" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              showNext()
            }}
          >
            <LuChevronRight className="h-8 w-8" />
            <span className="sr-only">Next image</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
  </div>
    </section>
  );
};

export default ClubGallery;
