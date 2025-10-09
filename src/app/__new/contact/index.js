import React from "react";
import ContactHero from "./hero";
import ContactForm from "./form";

const Contact = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12 lg:gap-20">
          {/* Left: headline */}
          <div className="flex w-full justify-center">
            <ContactHero />
          </div>

          {/* Right: form card (fixed comfortable width) */}
          <div className="flex justify-center lg:justify-end">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
