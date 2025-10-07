import React from 'react';
import TheosLogo from 'images/new/home/Theos_logo.png';
import SubwayLogo from 'images/new/home/Subway_logo.png';
import PapaJohnsLogo from 'images/new/home/apa_Johns_logo.png';
import TobyLogo from 'images/new/home/Toby_Carvery_logo.png';

const JobSearch = () => {
  return (
    <section
      className="w-full bg-white py-16"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-[1650px] mx-auto px-4">
        {/* Header */}
        <h1 className="text-center text-5xl text-[#488AFF] font-semibold mb-14">
          Job Search
        </h1>
        <p className="text-[#488AFF] text-[28px] text-left mb-4 pl-12">
          22,849 Jobs
        </p>
        <hr className="border-t border-[#488AFF]/30 mb-10" />

        {/* Grid Layout */}
        <div className="grid md:grid-cols-4">
          {/* ===== LEFT SIDEBAR ===== */}
          <div className="col-span-1 pr-2">
            <div className="flex flex-col space-y-6">
              {/* Keyword Search */}
              <div>
                <label className="block text-gray-500 text-sm mb-1.5">
                  Keyword Search
                </label>
                <input
                  type="text"
                  placeholder="Keyword"
                  className="w-full bg-transparent border border-[#D9D9D9] text-[#488AFF] placeholder:font-normal placeholder-[#488AFF] text-[14px] py-2 px-3 rounded-sm focus:outline-none focus:border-[#488AFF] transition-all"
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
                  className="w-full bg-transparent border border-[#D9D9D9] text-[#488AFF] placeholder:font-normal placeholder-[#488AFF] text-[14px] py-2 px-3 rounded-sm focus:outline-none focus:border-[#488AFF] transition-all"
                />
              </div>

              {/* Distance Dropdown */}
              <div className="relative">
                <select className="w-full bg-transparent border border-[#D9D9D9] text-[#488AFF] text-[14px] py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:border-[#488AFF] cursor-pointer appearance-none transition-all">
                  <option>25 miles</option>
                  <option>10 miles</option>
                  <option>50 miles</option>
                </select>

                {/* Right Dropdown Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </div>

              <hr className="border-[#E6E6E6]" />

              {/* Filter Sections */}
              {['Sectors', 'Salary Band', 'Contract Type'].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center border-b border-[#E6E6E6] cursor-pointer"
                  style={{
                    height: '44px',
                    marginTop: '10px',
                    paddingBottom: '10px'
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>

                  <p
                    className="text-[#488AFF] text-[15px]"
                    style={{
                      lineHeight: '1',
                      margin: '0',
                      paddingTop: '2px',
                      paddingLeft: '8px'
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}

              <button className="bg-[#488AFF] text-white font-bold text-[13px] tracking-wide py-3 w-full mt-4 uppercase hover:bg-blue-600 transition-all">
                Search
              </button>
            </div>
          </div>

          {/* ===== RIGHT JOB LIST ===== */}
          <div className="col-span-3">
            {[
              {
                logo: TheosLogo,
                title: 'Production Operatives',
                company: 'THEO’S FOOD COMPANY',
                description:
                  'Theo’s food company is first and foremost a family run business with a real passion for food and as such we take great pride in and are committed to...',
                location: 'West Midlands, WS9 8UD',
                salary: '£15 - £18 per hour',
                posted: '4 MONTHS AGO',
                qualification: 'Food Safety'
              },
              {
                logo: SubwayLogo,
                title: 'Sandwich Artist',
                company: 'Subway',
                description:
                  'Interested in a career in food retail sales? Passionate about customer service? Looking to work in a leading global franchise? With over 41,000 store...',
                location: 'Wakefield, WF1 3JP',
                salary: '£14 - £18 per hour',
                posted: '4 MONTHS AGO',
                qualification: 'Food Safety'
              },
              {
                logo: PapaJohnsLogo,
                title: 'Pizza Makers',
                company: 'Papa Johns',
                description:
                  'As a member of our store team, you will be the face for our customers ensuring they receive a hot, made to order meal. Or you could be working on the...',
                location: 'Sheffield, S13 8LZ',
                salary: '£12 - £15 per hour',
                posted: '5 MONTHS AGO',
                qualification: 'Food Safety, Food Hygiene, Level 2'
              },
              {
                logo: TobyLogo,
                title: 'Part Time Food Production Operative',
                company: 'Toby Carvery',
                description:
                  'With your support as a Part Time Food Production Operative at Toby Carvery - Captain Manby, everything will run smoothly! You’ll make sure the kitchen...',
                location: 'Darton, Barnsley, S75 5J5',
                salary: '£18 - £22 per hour',
                posted: '5 MONTHS AGO',
                qualification: 'Food Safety and Food Hygiene Level 2'
              }
            ].map((job, i) => (
              <div
                key={i}
                className="flex gap-14 items-start border-b border-gray-200 pl-6 pb-6 pt-6"
              >
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-36 h-36 object-contain"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-500">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[#488AFF] font-semibold uppercase tracking-wide mt-1">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">
                      {job.posted}
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-500 mt-1">
                    {job.description}
                  </p>
                  <div className="flex">
                    <p className="text-[14px] text-gray-500 mt-1">
                      {job.salary}
                    </p>
                    <svg
                      width="16"
                      height="23"
                      viewBox="0 0 16 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-1 mx-1"
                    >
                      <g clip-path="url(#clip0_55129_1010)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.3833 7.80201C14.3833 13.716 7.86158 21.2803 7.86158 21.2803C7.86158 21.2803 1.33984 13.8446 1.33984 7.80201C1.33984 4.19288 4.25245 1.28027 7.86158 1.28027C11.4707 1.28027 14.3833 4.19288 14.3833 7.80201Z"
                          stroke="#9B9B9B"
                          stroke-linejoin="round"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10.4703 8.23663C10.4703 9.67663 9.30162 10.8453 7.86162 10.8453C6.42162 10.8453 5.25293 9.67663 5.25293 8.23663C5.25293 6.79663 6.42162 5.62793 7.86162 5.62793C9.30162 5.62793 10.4703 6.79663 10.4703 8.23663Z"
                          stroke="#9B9B9B"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_55129_1010">
                          <rect
                            width="15"
                            height="22"
                            fill="white"
                            transform="translate(0.339844 0.280273)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="text-[14px] text-gray-500 mt-1">
                      {job.location}
                    </p>
                  </div>

                  <div className="flex mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded justify-start items-center">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <g clip-path="url(#clip0_55129_1016)">
                        <g clip-path="url(#clip1_55129_1016)">
                          <path
                            d="M14.4068 7.55537C13.8489 6.35919 12.6355 5.53027 11.2286 5.53027C9.8489 5.53027 8.6554 6.3274 8.0835 7.48625"
                            stroke="#C5C599"
                            stroke-width="1.16667"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M19.7628 7.94824C17.7751 5.96658 15.7865 3.98576 13.7975 2.00521C12.2666 0.480777 9.73264 0.483763 8.19888 2.01135C6.22017 3.98215 4.24169 5.95328 2.26333 7.92455C0.691779 9.49045 0.689672 12.0033 2.26029 13.573C4.23073 15.5422 6.20145 17.5111 8.17473 19.4775C8.95243 20.2525 9.89912 20.6291 10.9929 20.6446C12.099 20.632 13.051 20.2527 13.8343 19.4716C15.8118 17.4996 17.7883 15.5264 19.7632 13.5518C21.3026 12.0127 21.3018 9.4824 19.7628 7.94824Z"
                            stroke="#C5C599"
                            stroke-width="1.16667"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_55129_1016">
                          <rect
                            width="21"
                            height="21"
                            fill="white"
                            transform="translate(0.5 0.280273)"
                          />
                        </clipPath>
                        <clipPath id="clip1_55129_1016">
                          <rect
                            width="21"
                            height="21"
                            fill="white"
                            transform="translate(0.5 0.280273)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    Qualification Required:{' '}
                    <span className="text-gray-500 ml-1 underline">
                      {job.qualification}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-6">
              <button className="bg-[#488AFF] text-white font-semibold px-8 py-2 rounded hover:bg-blue-600 transition">
                Show More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSearch;
