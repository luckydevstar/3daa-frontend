const requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

const easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

const animatedScrollTo = (element, to, duration, callback) => {
  const start = element.scrollTop;
  const change = to - start;
  const animationStart = +new Date();

  let animating = true;
  let lastpos = null;

  const animateScroll = function() {
    if (!animating) {
      return;
    }
    requestAnimFrame(animateScroll);
    const now = +new Date();
    const val = Math.floor(
      easeInOutQuad(now - animationStart, start, change, duration)
    );
    if (lastpos) {
      if (lastpos === element.scrollTop) {
        lastpos = val;
        element.scrollTop = val;
      } else {
        animating = false;
      }
    } else {
      lastpos = val;
      element.scrollTop = val;
    }
    if (now > animationStart + duration) {
      element.scrollTop = to;
      animating = false;
      if (callback) {
        callback();
      }
    }
  };
  requestAnimFrame(animateScroll);
};

export default animatedScrollTo;
