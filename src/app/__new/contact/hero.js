import React from "react";

const ContactHero = () => {
  return (
    <div className="max-w-[460px] text-white mt-20" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <h1 className="mb-6 text-white text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
        Contact us
      </h1>
      <p className="text-lg lg:text-xl text-blue-50 leading-relaxed font-normal">
        We're happy to hear from you!
        <br />
        Drop us a message, and our dedicated team will get back to you shortly.
      </p>
    </div>
  );
};

export default ContactHero;


