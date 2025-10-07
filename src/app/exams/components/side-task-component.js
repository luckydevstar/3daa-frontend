import React from 'react';
import { map } from 'ramda';
import videos from './test-data';
import TaskCalendar from './task-calendar';
import { Carousel } from 'react-responsive-carousel';

const SideBarTask = () => (
  <div className="side-calendar">
    <TaskCalendar onBack={() => console.log('on back')} />
    <div className="carousel-canvas">
      <Carousel
        showIndicators={false}
        showThumbs={false}
        statusFormatter={(current, total) => `Task: ${current} of ${total}`}
      >
        {videos().length > 0 &&
          map(
            video => (
              <div className="card-canvas">
                <div className="card" key={video.cloudinary_file_id}>
                  <div className="card-content">
                    <figure className="is-4by3">
                      <video
                        src={`https://res.cloudinary.com/ncfe/video/upload/v1/${
                          video.cloudinary_file_id
                        }`}
                        controls
                        className="carousel-video"
                      />
                    </figure>
                  </div>
                  <div className="card-footer">
                    <div className="media">
                      <div className="media-left border-right">
                        <p className="media-due">DUE ON</p>
                        <label className="media-days">6</label>
                        <span className="media-month">JUN</span>
                      </div>

                      <div className="media-right desc-footer">
                        <p>
                          You will have explored the importance of person
                          centred care plans and how to support the
                          implementation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-before" />
                <div className="card-after" />
              </div>
            ),
            videos()
          )}
      </Carousel>
    </div>
  </div>
);

SideBarTask.propTypes = {};

SideBarTask.defaultProps = {};

export default SideBarTask;
