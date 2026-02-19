
import { getTestimonials } from "@/lib/api";
import { reportError } from "@/lib/reportError"; 
import Hero from "../components/landing/Hero";
import ActivityTypes from "../components/landing/ActivityTypes";
import NewsletterForm from "@/components/landing/NewsletterForm";
import TestimonialsCarousel from "@/components/landing/TestimonialCarousel";
import ContactForm from "@/components/landing/ContactForm";  
import Footer from "../components/landing/Footer";

export default async function LandingPage() {
  const testimonials = await getTestimonials();
  
  return (
      <main className="landing-page">
        <Hero />
        <ActivityTypes />
        <NewsletterForm />
        <TestimonialsCarousel testimonials={testimonials} />
        <ContactForm /> 
        <Footer />
      </main>
  );
}
