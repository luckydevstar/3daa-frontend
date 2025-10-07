import React from "react";

const FlippableCard = ({
    frontImage,
    logo,        // URL of the logo image shown in a circular badge
    backImage,
    title,
    subtitle,
    description, // Long text shown when the white panel expands
    isComingSoon,
}) => {
    const [flipped, setFlipped] = React.useState(false);

    return (
        <div
            className="relative w-[320px] h-[460px] rounded-2xl"
            style={{ perspective: "1200px" }} // 3D context
        >
            {/* 3D inner wrapper */}
            <div
                className={`relative h-full w-full transition-transform duration-500`}
                style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >   
                {isComingSoon && (
                    <div className="w-full h-full absolute left-0 top-0 flex items-center justify-center bg-[#ffffff]/90 z-[50] rounded-2xl">
                        <h3 className="text-[30px] font-[900] text-[#488AFF]">COMING SOON</h3>
                    </div>
                )}
                {/* FRONT */}
                <div
                    className="group absolute inset-0 overflow-hidden rounded-2xl shadow-lg"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{
                            backgroundImage: `url(${frontImage})`,
                        }}
                    />
                    {/* Subtle gradient for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/0" />

                    {/* Flip button (top-right) */}
                    <button
                        type="button"
                        onClick={() => setFlipped(true)}
                        aria-label="Flip card"
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/85 text-gray-800 transition hover:bg-white"
                    >
                        <i className="fa-solid fa-rotate text-[20px]"></i>
                    </button>

                    {/* White info panel (expands on hover anywhere on front) */}
                    <div className="absolute bottom-0 w-full">
                        <div className="relative bg-white shadow-lg transition-[max-height,box-shadow] duration-300 max-h-[116px] group-hover:max-h-[208px]">
                            {/* Circular logo badge overlapping the card */}
                            <div className="absolute -top-7 left-5 h-14 w-14 overflow-hidden rounded-full ring-4 ring-white bg-white">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700">
                                        LOGO
                                    </div>
                                )}
                            </div>

                            <div className="px-5 pt-9 pb-[32px]">
                                <h3 className="text-gray-900 text-[20px] font-semibold leading-tight">
                                    {title}
                                </h3>
                                <p className="text-blue-600 text-[20px] font-medium">
                                    {subtitle}
                                </p>

                                {/* Extra detail (only visible when expanded via hover) */}
                                <p className="mt-2 text-gray-600 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div
                    className="absolute inset-0 overflow-hidden rounded-2xl"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                    }}
                >
                    {/* Back background image */}
                    <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{ backgroundImage: `url(${backImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Flip-back button */}
                    <button
                        type="button"
                        onClick={() => setFlipped(false)}
                        aria-label="Flip back"
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/85 text-gray-800 shadow-md transition hover:bg-white"
                    >
                        <i className="fa-solid fa-rotate text-[20px]"></i>
                    </button>

                    {/* Back content area */}
                    <div className="absolute bottom-0 bg-white/95 p-[12px]">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white bg-white">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </div>
                            <div>
                                <h4 className="text-gray-900 font-semibold">{title}</h4>
                                <p className="text-blue-600 text-xs font-medium">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-700">
                            {/* Put whatever back-side info you need here */}
                            <p>
                                This is the back of the card. You can place training details,
                                links, or a short summary. Click the flip button to return to
                                the front.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlippableCard;
