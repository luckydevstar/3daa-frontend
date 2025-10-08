import React, { useState } from "react";

const ContactForm = () => {
  const [contactMethod, setContactMethod] = useState("email");

  return (
    <div className="w-full max-w-[480px] rounded-2xl bg-white shadow-2xl p-6 md:p-8 lg:p-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Get in touch</h2>

      <form className="space-y-6">
        <div>
          <input
            type="text"
            id="fullname"
            name="fullname"
            className="w-full bg-transparent px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-900 placeholder-gray-400"
            placeholder="Full Name"
          />
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full bg-transparent px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-900 placeholder-gray-400"
            placeholder="Email"
          />
        </div>

        <div>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full bg-transparent px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-900 placeholder-gray-400"
            placeholder="Phone"
          />
        </div>

        <div className="flex items-center gap-8 pt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="contactMethod"
              value="email"
              checked={contactMethod === "email"}
              onChange={(e) => setContactMethod(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Email</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="contactMethod"
              value="phone"
              checked={contactMethod === "phone"}
              onChange={(e) => setContactMethod(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Phone</span>
          </label>
        </div>

        <div>
          <input
            type="text"
            id="reason"
            name="reason"
            className="w-full bg-transparent px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-900 placeholder-gray-400"
            placeholder="Reason for getting in touch"
          />
        </div>

        <div>
          <textarea
            id="message"
            name="message"
            rows="1"
            className="w-full bg-transparent px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-gray-900 placeholder-gray-400 resize-none"
            placeholder="Message"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 py-4 font-semibold uppercase tracking-wider text-white transition hover:bg-blue-600"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
