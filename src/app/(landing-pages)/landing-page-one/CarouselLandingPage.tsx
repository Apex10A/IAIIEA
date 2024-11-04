import EmblaCarousel from './EmblaLand';

const slides = [0, 1]; // Slide indexes for your content

const Index: React.FC = () => {
    return (
      <div className="flex items-center w-full">
        <EmblaCarousel autoPlayInterval={5000} />
      </div>
    );
  };

export default Index;
