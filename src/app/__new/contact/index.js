import React from "react";
import ContactHero from "./hero";
import ContactForm from "./form";

const Contact = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-20">
          {/* Left: headline */}
          <div className="order-2 lg:order-1">
            <ContactHero />
          </div>

          {/* Right: form card (fixed comfortable width) */}
          <div className="order-1 lg:order-2 flex justify-start lg:justify-end">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
