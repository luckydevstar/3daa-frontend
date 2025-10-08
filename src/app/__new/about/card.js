import React from "react";
import CardImage from "images/new/home/3daa-card.png";

const CardShowcase = () => {
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

        <div className="mt-8 text-center text-blue">
          <a
            href="#"
            className="text-sm text-blue underline underline-offset-4 hover:text-blue-300"
          >
            Click to View
          </a>
        </div>
      </div>
    </section>
  );
};

export default CardShowcase;
