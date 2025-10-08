import React, {useRef, useState, useEffect} from "react";
import CardImage from "images/new/home/3daa-card.png";

const CardShowcase = ({}) => {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (open && detailsRef.current) {
      // smooth focus/scroll when details appear
      detailsRef.current.focus({ preventScroll: true });
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [open]);

  return (
    <section className="relative bg-transparent">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-10 lg:py-14">
        <h3 className="text-white text-center text-3xl sm:text-4xl font-extrabold drop-shadow">
          3DAA card
        </h3>

        <div className="mt-8 flex justify-center">
          <div className="relative rounded-2xl bg-white shadow-2xl">
            <img
              src={CardImage}
              alt="3DAA Card"
              className="h-[180px] w-[300px] rounded-xl object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 -bottom-7 -translate-x-1/2
                        h-6 w-[320px] rounded-full bg-black/35 blur-[10px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 -bottom-8 -translate-x-1/2
                        h-7 w-[360px] rounded-full bg-black/20 blur-[18px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 -bottom-9 -translate-x-1/2
                        h-8 w-[400px] rounded-full bg-black/10 blur-[26px]"
            />
          </div>
        </div>

        {!open ? (
          <div className="mt-10 text-center">
            <button
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="text-sm text-blue-700 underline underline-offset-4 hover:text-blue-800"
            >
              Click to View
            </button>
          </div>
        ) : (
          <div
            ref={detailsRef}
            tabIndex={-1}
            className="mt-[100px] outline-none"
            style={{fontFamily: "Montserrat"}}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close details"
              className="absolute right-0 top-[26rem] inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>

            {/* Header + subnote */}
            <div className="text-center">
              <h4 className="text-xl sm:text-2xl font-extrabold text-[#3B82F6]">
                Become a member and gain access to everything 3DAA
              </h4>
              <p className="mt-1 text-xs font-semibold text-black">
                This 3DAA Card is available for members only
              </p>
            </div>

            {/* Content grid */}
            <div className="mt-[70px] grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-center">
              {/* Left: larger card + shadow */}
              <div className="flex justify-center lg:justify-center">
                <div className="relative">
                  <img
                    src={CardImage}
                    alt="3DAA Card enlarged"
                    className="h-[220px] w-[370px] rounded-xl object-cover"
                  />
                  <div className="pointer-events-none absolute left-1/2 -bottom-6 -translate-x-1/2 h-6 w-[360px] rounded-full bg-black/30 blur-[12px]" />
                  <div className="pointer-events-none absolute left-1/2 -bottom-7 -translate-x-1/2 h-7 w-[420px] rounded-full bg-black/15 blur-[20px]" />
                </div>
              </div>

              {/* Right: copy + CTA */}
              <div className="mt-4">
                <h5 className="text-2xl font-extrabold text-[#3B82F6]">
                  The No.1 Card for the 3D Architectural Industry!
                </h5>
                <p className="mt-4 text-xs text-base text-black">
                  The 3D Architectural Academy card serves as proof that individuals are members of
                  the 3DAA Community. It verifies skills, software and digital badges earned, and
                  offers a way to view progress and portfolio. Members can showcase achievements,
                  access exclusive events, and stand out professionally.
                </p>
                <button
                  className="mt-6 inline-flex items-center rounded-full bg-amber-400 px-6 py-3 font-semibold text-gray-900 hover:bg-amber-300"
                  onClick={() => {/* navigate to membership route */}}
                >
                  Become a member
                </button>

                
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardShowcase;
