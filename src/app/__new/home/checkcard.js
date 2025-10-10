import React from 'react';

const CheckCard = () => {
  return (
    <section
      className="w-full bg-[#488AFF] py-24"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 px-6 items-center text-white">
        {/* ===== Left Side (Form) ===== */}
        <div className="flex flex-col items-center md: items-start">
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight"
            style={{
              fontFamily: '"Nunito Sans", sans-serif',
              fontWeight: 600,
              color: 'white'
            }}
          >
            Check a 3DAA card
          </h2>

          <form className="w-full max-w-sm space-y-5">
            <input
              type="text"
              placeholder="12 digit number"
              className="w-full bg-transparent border border-white/80 placeholder-white/70 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-[16px]"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            />
            <input
              type="text"
              placeholder="Full name"
              className="w-full bg-transparent border border-white/80 placeholder-white/70 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-[16px]"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            />
            <input
              type="text"
              placeholder="Expiry date"
              className="w-full bg-transparent border border-white/80 placeholder-white/70 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-[16px]"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            />

            {/* Right-aligned button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-white text-[#488AFF] font-extrabold py-3 px-8 rounded-md hover:bg-gray-100 transition-all duration-300 shadow-sm tracking-wide"
                style={{ fontFamily: '"Nunito Sans", sans-serif' }}
              >
                Validate
              </button>
            </div>
          </form>
        </div>

        {/* ===== Right Side (Description) ===== */}
        <div
          className="text-white/90 leading-relaxed text-[16px]"
          style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: 24 }}
        >
          <p className="mb-4 font-medium">
            Check whether a 3DAA card is valid.
          </p>
          <p className="mb-4">
            3DAA Quick Check allows all cards with a 3DAA logo – both physical
            and virtual – to be checked and verified.
          </p>
          <p>
            You will need the 12 digit number, the name of the card holder, and
            the expiry date that is displayed and on the card.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CheckCard;
