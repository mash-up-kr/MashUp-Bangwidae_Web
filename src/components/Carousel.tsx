import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode;
  className?: string;
  settings?: Settings;
}

function Carousel({ children, className, settings }: CarouselProps) {
  return (
    <Slider
      {...settings}
      className={` ${className}`}
      speed={500}
      arrows={false}
      slidesToShow={1}
      slidesToScroll={1}
      infinite={false}
      variableWidth
    >
      {children}
    </Slider>
  );
}

export default Carousel;
