import React from 'react';
import PropTypes from 'prop-types';

const ContentsViewer = ({
  brand_webfont_system_font,
  brand_colors_primary,
  brand_colors_secondary
}) => (
  <div className="contents-viewer">
    <div className="inner" style={{ fontFamily: brand_webfont_system_font }}>
      <div
        className="ex-title"
        style={{ backgroundColor: brand_colors_primary }}
      >
        Example Title
      </div>
      <div className="ex-headline m-t-20">Example Headline</div>
      <div className="ex-text m-t-20" style={{ color: brand_colors_secondary }}>
        The stars kept the party going after the glittering annual Golden Globe
        Awards at The Beverly Hilton on Sunday. Keeping up a show of solidarity
        for the Time's Up initiative, Kate Beckinsale (far left) and pregnant
        Miranda Kerr (second from right) led the red carpet arrivals at the
        InStyle and Warner Bros. after party wearing dramatic black gowns, while
        Mariah Carey posed up a storm with her toyboy boyfriend Brian Tanaka
        (far right). Elsewhere, Paris Hilton (second from left) was putting on a
        glamorous display at the HBO after party, flaunting her new diamond
        sparkler following her engagement to Chris Zylka. The A-list attendees
        celebrated well into the night, with Heidi Klum and Emily Ratajkowski
        (centre) putting on a playful display on the dancefloor with a cheeky
        kiss.
      </div>

      <div className="btns m-t-50 m-l-50 p-b-50">
        <button className="button is-default is-outlined">Button</button>
        <button
          className="button is-primary"
          style={{ backgroundColor: brand_colors_primary }}
        >
          Button
        </button>
      </div>
    </div>
  </div>
);

ContentsViewer.propTypes = {
  brand_webfont_system_font: PropTypes.string,
  brand_colors_primary: PropTypes.string,
  brand_colors_secondary: PropTypes.string
};

ContentsViewer.defaultProps = {
  brand_webfont_system_font: 'Open Sans',
  brand_colors_primary: '',
  brand_colors_secondary: ''
};

export default ContentsViewer;
