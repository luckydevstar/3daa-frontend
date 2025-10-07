import React from "react";

import Image1 from "images/new/home/home-img1.jpg";
import Image2 from "images/new/home/home-img2.png";
import Image3 from "images/new/home/home-img3.jpg";
import Image4 from "images/new/home/home-img4.jpg";
import Image5 from "images/new/home/home-img5.jpg";
import Image6 from "images/new/home/home-img6.jpg";
import ImageLogo from "images/new/home/logo.png";

const HomeShowcase = () => {
    return (
        <div className="flex relative justify-between items-end w-full overflow-hidden pt-2 mb-12">
            <div>
                <img className="w-60 h-auto object-contain rounded-xl -ml-[20px] z-30 relative" src={Image6} />
                <img className="w-72 h-auto object-contain rounded-xl -mt-[200px] z-10 ml-[230px]" src={Image5} />
                <img className="w-[432px] h-auto object-contain rounded-xl -mt-[60px] ml-[40px] z-20" src={Image4} />
            </div>
            <div className="">
                <img className="w-60 h-60" src={ImageLogo} />
            </div>
            <div>
                <img className="w-[180px] h-auto object-contain rounded-xl -ml-[40px] z-30 relative" src={Image3} />
                <img className="w-[320px] h-auto object-contain rounded-xl -mt-[120px] z-20 relative ml-[180px]" src={Image2} />
                <img className="w-[440px] h-auto object-contain rounded-xl -mt-[100px] mr-[40px] z-10" src={Image1} />
            </div>
            <div className="absolute bottom-0 z-40 h-[300px] w-full" style={{background: "linear-gradient(to bottom, transparent, white)"}}></div>
        </div>
    )
}

export default HomeShowcase;
