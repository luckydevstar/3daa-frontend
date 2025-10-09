import React from 'react';
import JoinBackground from 'images/new/home/join-background.jpg';

const Join3DAA = () => {
  // Works whether your app scrolls the window or an inner wrapper
  // drop-in replacement (plain JS, Node 12 friendly)
const scrollToTop = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Collect possible scroll containers (document + common wrappers)
  var root1 = document.scrollingElement || document.documentElement;
  var root2 = document.body;
  var extras = Array.prototype.slice.call(
    document.querySelectorAll("[data-scroll-container], .overflow-y-auto, .overflow-auto, main")
  );

  // Animation (no 'behavior: smooth' - works everywhere)
  var start = null;
  var startPos = Math.max(
    (root1 && root1.scrollTop) || 0,
    (root2 && root2.scrollTop) || 0,
    extras.reduce(function (m, el) { return Math.max(m, el.scrollTop || 0); }, 0)
  );
  if (startPos === 0) return;

  var duration = 400; // ms
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var y = Math.round(startPos * (1 - easeOutCubic(p)));

    if (root1) root1.scrollTop = y;
    if (root2) root2.scrollTop = y;
    extras.forEach(function (el) { if (el) el.scrollTop = y; });

    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
};


  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url(' + JoinBackground + ')'
      }}
    >
      {/* Soft overlay — does not block clicks */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-8 md:px-16">
        {/* LEFT — Headline */}
        <div className="text-[#488AFF] font-bold text-5xl leading-tight md:w-1/2 mb-12 md:mb-0 mt-12 md:mt-0">
          <h1
            style={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: '600',
            }}
            className='text-center md:text-left text-3xl sm:text-4xl md:text-6xl'
          >
            Join the
            <br />
            3DAA
            <br />
            Community
          </h1>
        </div>

        {/* RIGHT — Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 w-full md:w-[400px]">
          {/* Logo + Heading */}
          <div className="flex flex-col items-center mb-5 text-black ">
            <div className="bg-[#488AFF] text-white font-bold px-2 py-1 rounded-md text-sm">
              3D
            </div>
            <h2
              className="text-xl font-semibold mt-3"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Join <span className="text-[#488AFF]">3DAA</span>
            </h2>
            <p className="text-sm mt-1">Create an Account</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-[#488AFF]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">
                  Surname
                </label>
                <input
                  type="text"
                  placeholder="Surname"
                  className="w-full border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-[#488AFF]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-[#488AFF]"
              />
              {/* Keep your original placement; you can center with top-1/2 -translate-y-1/2 if you prefer */}
              <button
                type="button"
                className="absolute right-3 top-16 text-[#488AFF] text-xs font-medium underline"
              >
                Verify
              </button>
            </div>

            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-[#488AFF]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Birthdate
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="w-full border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-[#488AFF]"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FDBA4A] text-white font-semibold py-2.5 rounded-md hover:bg-[#f9ad2f] transition-all mt-2"
            >
              Continue
            </button>
          </form>

          {/* Terms & Footer */}
          <p className="text-[11px] text-gray-500 mt-4 text-center leading-relaxed">
            By continuing, you agree to 3daa’s
            <br />
            <span className="font-bold text-black">Terms of Service</span> and
            acknowledge you’ve read our
            <br />
            <span className="font-bold text-black">Privacy Policy</span>. Notice
            at collection.
          </p>
          <p className="text-sm text-black text-center mt-3">
            Already a member?{' '}
            <a
              href="#"
              className="hover:text-[#488AFF] text-black hover:underline font-semibold"
            >
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Scroll-up button (works even with inner scroll wrappers) */}
      <button
        onClick={scrollToTop}
        type='button'
        className="absolute top-3 md:top-6 left-1/2 -translate-x-1/2 z-20 bg-[#488AFF] text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </section>
  );
};

export default Join3DAA;
