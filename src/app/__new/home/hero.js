import React from "react";
import Slider from "react-slick";

const HomeHero = () => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="py-16">
                <Slider {...sliderSettings}>
                    <div>
                        <div className="flex flex-col justify-center items-center gap-4 mb-16">
                            <h3 className="text-5xl !font-black text-black mb-2">Sign up to</h3>
                            <h3 className="text-6xl !font-black text-[#488AFF]">join the 3DAA community</h3>
                            <h3 className="text-5xl !font-black text-[#488AFF]">this September</h3>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col justify-center items-center gap-4 mb-16">
                            <h3 className="text-5xl !font-black text-black mb-2">Sign up to</h3>
                            <h3 className="text-6xl !font-black text-[#488AFF]">
                                join the
                                <span className="text-7xl">
                                    3DAA
                                </span>
                                community
                            </h3>
                            <h3 className="text-5xl !font-black text-[#488AFF]">this September</h3>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col justify-center items-center gap-4 mb-16">
                            <h3 className="text-5xl !font-black text-black mb-2">Sign up to</h3>
                            <h3 className="text-6xl !font-black text-[#488AFF]">join the 3DAA community</h3>
                            <h3 className="text-5xl !font-black text-[#488AFF]">this September</h3>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col justify-center items-center gap-4 mb-16">
                            <h3 className="text-5xl !font-black text-black mb-2">Sign up to</h3>
                            <h3 className="text-6xl !font-black text-[#488AFF]">join the 3DAA community</h3>
                            <h3 className="text-5xl !font-black text-[#488AFF]">this September</h3>
                        </div>
                    </div>
                </Slider>
            </div>
        </div>
    )
}

export default HomeHero;
