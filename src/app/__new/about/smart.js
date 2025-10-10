import React, { Fragment } from 'react';

// swap for your asset if needed
import heroBg from 'images/new/about/background.jpg';

const items = [
  { letter: 'S', caption: 'Social Networks' },
  { letter: 'M', caption: 'Membership Management' },
  { letter: 'A', caption: 'Adaptive Recruitment' },
  { letter: 'R', caption: 'Revenue Creation' },
  { letter: 'T', caption: 'Training Systems' }
];

const Dot = () => (
  <div
    aria-hidden
    className="mx-1 sm:mx-1.5 lg:mx-2 text-white leading-none
               text-[44px] sm:text-[66px] lg:text-[88px] mt-20"
  >
    •
  </div>
);

const Unit = ({ letter, caption }) => (
  <div
    className="
      flex flex-col items-center justify-start select-none
      h-[200px] sm:h-[240px] lg:h-[280px]
      w-[50px] sm:w-[98px] lg:w-[112px]
    "
  >
    {/* Letter box with fixed height so all captions line up */}
    <div
      className="flex items-end justify-center w-full
                    h-[140px] sm:h-[176px] lg:h-[208px]"
    >
      <span
        className="
          text-white font-extrabold leading-none tracking-[0.01em]
          text-[84px] sm:text-[112px] lg:text-[132px]
        "
      >
        {letter}
      </span>
    </div>

    <div className="mt-2 text-[10px] sm:text-[11px] lg:text-[12px] font-semibold text-black/85 text-center">
      {caption}
    </div>
  </div>
);

const HeroSmartFlex = () => {
  return (
    <section className="relative isolate">
      <div className="relative mx-auto w-full max-w-[1100px] px-5 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* tighter row */}
        <div className="flex items-center justify-center flex-wrap">
          {items.map((it, i) => (
            <Fragment key={it.letter}>
              <Unit letter={it.letter} caption={it.caption} />
              {i < items.length - 1 && <Dot />}
            </Fragment>
          ))}
        </div>

        {/* Pricing pill – keep comfortable position */}
        <div className="hidden lg:block absolute right-8 bottom-6">
          <a
            href="/pricing"
            className="inline-flex items-center gap-3 rounded-xl border border-white/80 px-5 py-2 text-white/95 hover:bg-white/10 transition"
          >
            <span className="text-[15px] tracking-wide">Pricing</span>
            <svg
              viewBox="0 0 28 12"
              className="h-3.5 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 6h24" />
              <path d="M20 1l5 5-5 5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSmartFlex;
