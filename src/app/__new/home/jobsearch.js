import React from "react";
import TheosLogo from "images/new/home/Theos_logo.png";
import SubwayLogo from "images/new/home/Subway_logo.png";
import PapaJohnsLogo from "images/new/home/apa_Johns_logo.png";
import TobyLogo from "images/new/home/Toby_Carvery_logo.png";

const JOBS = [
  {
    logo: TheosLogo,
    title: "Production Operatives",
    company: "THEO’S FOOD COMPANY",
    description:
      "Theo’s food company is first and foremost a family run business with a real passion for food and as such we take great pride in and are committed to...",
    location: "West Midlands, WS9 8UD",
    salary: "£15 - £18 per hour",
    posted: "4 MONTHS AGO",
    qualification: "Food Safety",
  },
  {
    logo: SubwayLogo,
    title: "Sandwich Artist",
    company: "Subway",
    description:
      "Interested in a career in food retail sales? Passionate about customer service? Looking to work in a leading global franchise? With over 41,000 store...",
    location: "Wakefield, WF1 3JP",
    salary: "£14 - £18 per hour",
    posted: "4 MONTHS AGO",
    qualification: "Food Safety",
  },
  {
    logo: PapaJohnsLogo,
    title: "Pizza Makers",
    company: "Papa Johns",
    description:
      "As a member of our store team, you will be the face for our customers ensuring they receive a hot, made to order meal. Or you could be working on the...",
    location: "Sheffield, S13 8LZ",
    salary: "£12 - £15 per hour",
    posted: "5 MONTHS AGO",
    qualification: "Food Safety, Food Hygiene, Level 2",
  },
  {
    logo: TobyLogo,
    title: "Part Time Food Production Operative",
    company: "Toby Carvery",
    description:
      "With your support as a Part Time Food Production Operative at Toby Carvery - Captain Manby, everything will run smoothly! You’ll make sure the kitchen...",
    location: "Darton, Barnsley, S75 5J5",
    salary: "£18 - £22 per hour",
    posted: "5 MONTHS AGO",
    qualification: "Food Safety and Food Hygiene Level 2",
  },
];

const JobSearch = () => {
  return (
    <section
      className="w-full bg-white py-10 sm:py-14"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl text-[#488AFF] font-semibold mb-6 sm:mb-10">
          Job Search
        </h1>

        {/* Count */}
        <p className="text-[#488AFF] text-lg sm:text-2xl lg:text-[28px] text-center sm:text-left mb-4">
          22,849 Jobs
        </p>
        <hr className="border-t border-[#488AFF]/30 mb-6 sm:mb-10" />

        {/* Layout:
            - mobile: stack (filters centered, then jobs centered)
            - md: 2 cols (sidebar + jobs)
            - lg: 4 cols (sidebar 1 col, jobs 3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* ===== Filters (left) ===== */}
          <aside
            className="
              order-1
              md:order-none
              lg:col-span-1
              lg:pr-2
              w-full
              mx-auto
              max-w-md           /* center & constrain on small screens */
              md:max-w-none
            "
          >
            <div className="flex flex-col space-y-4 sm:space-y-6">
              {/* Keyword */}
              <div>
                <label className="block text-gray-500 text-sm mb-1.5">
                  Keyword Search
                </label>
                <input
                  type="text"
                  placeholder="Keyword"
                  className="w-full bg-transparent border border-[#D9D9D9] text-[#488AFF] placeholder-[#488AFF] text-sm sm:text-[14px] py-2 px-3 rounded-sm focus:outline-none focus:border-[#488AFF] transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-500 text-sm mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter region, town or city"
                  className="w-full bg-transparent border border-[#D9D9D9] text-[#488AFF] placeholder-[#488AFF] text-sm sm:text-[14px] py-2 px-3 rounded-sm focus:outline-none focus:border-[#488AFF] transition-all"
                />
              </div>

              {/* Distance */}
              <div className="relative">
                <select className="w-full bg-transparent border border-[#D9D9D9] text-[#488AFF] text-sm sm:text-[14px] py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:border-[#488AFF] cursor-pointer transition-all appearance-none">
                  <option>25 miles</option>
                  <option>10 miles</option>
                  <option>50 miles</option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <hr className="border-[#E6E6E6]" />

              {["Sectors", "Salary Band", "Contract Type"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex items-center justify-between w-full border-b border-[#E6E6E6] py-3"
                >
                  <span className="text-[#488AFF] text-[15px]">{item}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              ))}

              <button className="bg-[#488AFF] text-white font-bold text-[13px] tracking-wide py-3 w-full mt-1 uppercase hover:bg-blue-600 transition-all">
                Search
              </button>
            </div>
          </aside>

          {/* ===== Jobs (right) ===== */}
          <main
            className="
              md:col-span-1
              lg:col-span-3
              order-2
              w-full
              mx-auto
              max-w-2xl       /* center & constrain on small screens */
              md:max-w-none
            "
          >
            {JOBS.map((job, i) => (
              <article
                key={i}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8 lg:gap-14 items-start border-b border-gray-200 px-0 sm:pl-4 lg:pl-6 py-5 sm:py-6"
              >
                {/* Logo */}
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-36 lg:h-36 object-contain mx-auto sm:mx-0"
                />

                {/* Content */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-600">
                        {job.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#488AFF] font-semibold uppercase tracking-wide mt-1">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-1 sm:mt-0">
                      {job.posted}
                    </span>
                  </div>

                  <p className="text-[13px] sm:text-[14px] text-gray-600 mt-2">
                    {job.description}
                  </p>

                  {/* Salary + Location */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-1 sm:gap-2 mt-2">
                    <p className="text-[13px] sm:text-[14px] text-gray-600">{job.salary}</p>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-start sm:items-center">
                      <svg
                        width="16"
                        height="23"
                        viewBox="0 0 16 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-[2px] sm:mt-0 mx-1"
                      >
                        <g clipPath="url(#clip0)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.3833 7.80201C14.3833 13.716 7.86158 21.2803 7.86158 21.2803C7.86158 21.2803 1.33984 13.8446 1.33984 7.80201C1.33984 4.19288 4.25245 1.28027 7.86158 1.28027C11.4707 1.28027 14.3833 4.19288 14.3833 7.80201Z"
                            stroke="#9B9B9B"
                            strokeLinejoin="round"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.4703 8.23663C10.4703 9.67663 9.30162 10.8453 7.86162 10.8453C6.42162 10.8453 5.25293 9.67663 5.25293 8.23663C5.25293 6.79663 6.42162 5.62793 7.86162 5.62793C9.30162 5.62793 10.4703 6.79663 10.4703 8.23663Z"
                            stroke="#9B9B9B"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="15" height="22" fill="white" transform="translate(0.34 0.28)" />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className="text-[13px] sm:text-[14px] text-gray-600">{job.location}</p>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="inline-flex mt-2 text-[11px] sm:text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <g clipPath="url(#clipA)">
                        <g clipPath="url(#clipB)">
                          <path
                            d="M14.4068 7.55537C13.8489 6.35919 12.6355 5.53027 11.2286 5.53027C9.8489 5.53027 8.6554 6.3274 8.0835 7.48625"
                            stroke="#C5C599"
                            strokeWidth="1.16667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M19.7628 7.94824C17.7751 5.96658 15.7865 3.98576 13.7975 2.00521C12.2666 0.480777 9.73264 0.483763 8.19888 2.01135C6.22017 3.98215 4.24169 5.95328 2.26333 7.92455C0.691779 9.49045 0.689672 12.0033 2.26029 13.573C4.23073 15.5422 6.20145 17.5111 8.17473 19.4775C8.95243 20.2525 9.89912 20.6291 10.9929 20.6446C12.099 20.632 13.051 20.2527 13.8343 19.4716C15.8118 17.4996 17.7883 15.5264 19.7632 13.5518C21.3026 12.0127 21.3018 9.4824 19.7628 7.94824Z"
                            stroke="#C5C599"
                            strokeWidth="1.16667"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clipA">
                          <rect width="21" height="21" fill="white" transform="translate(0.5 0.28)" />
                        </clipPath>
                        <clipPath id="clipB">
                          <rect width="21" height="21" fill="white" transform="translate(0.5 0.28)" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>Qualification Required:</span>
                    <span className="ml-1 underline">{job.qualification}</span>
                  </div>
                </div>
              </article>
            ))}

            <div className="flex justify-center pt-6">
              <button className="bg-[#488AFF] text-white font-semibold px-6 sm:px-8 py-2 rounded hover:bg-blue-600 transition">
                Show More
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default JobSearch;
