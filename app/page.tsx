

export default async function LandingPage() {
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
