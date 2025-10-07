import React from 'react';
import CardImage from 'images/new/home/3daa-card.png';

const ApplyCard = () => {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-6">
        {/* ===== Heading ===== */}
        <h2
          className="text-[40px] md:text-[48px] font-bold text-gray-900 leading-tight"
          style={{
            fontFamily: '"Liberation Sans", sans-serif',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}
        >
          Apply for your{' '}
          <span className="text-[#488AFF] font-bold">3DAA card</span>
        </h2>
        <p
          className="text-gray-700 mt-2 text-[17px] md:text-[18px]"
          style={{
            fontFamily: '"Liberation Sans", sans-serif',
            letterSpacing: '0.3px'
          }}
        >
          Accreditation for the 3D Architectural industry
        </p>

        {/* ===== Card Image ===== */}
        <div className="mt-10 flex flex-col items-center">
          <img
            src={CardImage}
            alt="3DAA Membership Card"
            className="w-[320px] md:w-[380px] rounded-lg shadow-md"
          />
          <p className="text-sm text-[#488AFF] mt-2 underline cursor-pointer hover:text-blue-600">
            Click to View
          </p>
        </div>

        {/* ===== Description Section ===== */}
        <div className="mt-16 grid md:grid-cols-2 gap-10 md:gap-14 text-left w-full">
          {/* Left text */}
          <div className="text-gray-700 leading-relaxed text-[16px] md:text-[17px]">
            <p
              style={{
                fontFamily: '"Montserrat", sans-serif',
                lineHeight: '1.8'
              }}
            >
              The 3D Architectural Academy card serves as proof that individuals
              are members of the 3DAA Community. It is a way of verifying that
              an individual has had the highest level training, being able to
              see what skills, software and digital badges they have under their
              belt, as well as a way to view their profile, progress, and
              portfolio.
            </p>
          </div>

          <div className="flex flex-col justify-start items-start space-y-4 text-left">
            <h3
              className="text-[18px] md:text-[20px] font-bold text-[#488AFF] leading-snug"
              style={{
                fontFamily: '"Montserrat", sans-serif',
                lineHeight: '1.8'
              }}
            >
              The No.1 Card for the 3D Architectural Industry!
            </h3>

            <button
              className="bg-[#488AFF] text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition-all text-[15px] shadow-sm self-end"
              style={{
                fontFamily: '"Liberation Sans", sans-serif'
              }}
            >
              Find out more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyCard;
