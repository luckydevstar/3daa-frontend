import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
import { map } from 'ramda';
import { Link } from 'react-router';
import common from 'app/common';

const { createCloudinaryUrl } = common.util.helpers;

import Slider from 'react-slick';
class VideoCarousel extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000
    };

    const { videos } = this.props;
    return (
      <div className="favourite-video-slider">
        <Slider {...settings}>
          {map(
            video => (
              <div
                className="video-items"
                key={`videos-favourite-${video.data.object_id}`}
              >
                <img
                  src={`${createCloudinaryUrl(
                    video.data.thumbnail
                      ? video.data.thumbnail
                      : video.data.cloudinary_file_id,
                    video.data.thumbnail ? 'image' : 'thumbnail'
                  )}`}
                />
                <div className="legend">
                  <div className="container">
                    <div className="details p-l-50 m-l-50">
                      <p className="p-t-15 has-text-primary is-size-4">
                        {video.video_category_title}
                      </p>
                      <p className="p-t-15 has-text-white is-size-5">
                        {video.data.title}
                      </p>
                      <p className="p-t-15 description">
                        {video.data.description}
                      </p>
                      <Link
                        className="m-t-20 button is-primary"
                        to={`/videos/${video.video_category_id}/${video.data.media_id}`}
                      >
                        <i className="fa fa-play p-r-10" /> Watch Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ),
            videos
          )}
        </Slider>
      </div>
    );
  }
}

// const VideoCarousel = ({ videos }) =>
//   videos &&
//   videos.length > 0 && (
//     <div className="favourite-video-slider">
//       <Carousel
//         autoplay
//         wrapAround
//         pauseOnHover
//         // autoplayInterval={5000}
//         renderCenterLeftControls={({ previousSlide }) => (
//           <button onClick={previousSlide}>
//             <i className="fa fa-angle-left" />
//           </button>
//         )}
//         renderCenterRightControls={({ nextSlide }) => (
//           <button onClick={nextSlide}>
//             <i className="fa fa-angle-right" />
//           </button>
//         )}
//       >
//         {map(
//           video => (
//             <div
//               className="video-items"
//               key={`videos-favourite-${video.data.object_id}`}
//             >
//               <img
//                 src={`${createCloudinaryUrl(
//                   video.data.thumbnail
//                     ? video.data.thumbnail
//                     : video.data.cloudinary_file_id,
//                   video.data.thumbnail ? 'image' : 'thumbnail'
//                 )}`}
//               />
//               <div className="legend">
//                 <div className="container">
//                   <div className="details p-t-50 p-l-50 m-l-50">
//                     <p className="p-t-15 has-text-primary is-size-4">
//                       {video.video_category_title}
//                     </p>
//                     <p className="p-t-15 has-text-white is-size-5">
//                       {video.data.title}
//                     </p>
//                     <p className="p-t-15 description">
//                       {video.data.description}
//                     </p>
//                     <Link
//                       className="m-t-20 button is-primary"
//                       to={`/videos/${video.video_category_id}/${
//                         video.data.media_id
//                       }`}
//                     >
//                       <i className="fa fa-play p-r-10" /> Watch Now
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ),
//           videos
//         )}
//       </Carousel>
//     </div>
//   );

export default VideoCarousel;
