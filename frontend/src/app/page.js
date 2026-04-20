import Hero from "@/components/Hero";
import ShopByOccasion from "@/components/ShopByOccasion";
import OfferBanner from "@/components/OfferBanner";
import ProductSlider from "@/components/ProductSlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";
import FAQSection from "@/components/FAQSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">
      <Hero />
      <ShopByOccasion />
      <ProductSlider title="French Press on Nails" />
      <OfferBanner />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      {/* <BlogSection /> */}
      <FAQSection />
      <Newsletter />
      <Footer />
    </main>
  );
}
