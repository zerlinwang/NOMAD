window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
    slidesToScroll: 1,
    slidesToShow: 2,
    centerMode: true, // Enable center mode
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
};

		// Initialize all div with carousel class
    if (window.bulmaCarousel) {
      var carousels = bulmaCarousel.attach('.carousel', options);

      // Loop on each carousel initialized
      for(var i = 0; i < carousels.length; i++) {
		  // Add listener to  event
		  carousels[i].on('before:show', state => {
			  console.log(state);
		  });
      }

      // Access to bulmaCarousel instance of an element
      var element = document.querySelector('#my-element');
      if (element && element.bulmaCarousel) {
		  // bulmaCarousel instance is available as element.bulmaCarousel
		  element.bulmaCarousel.on('before-show', function(state) {
			  console.log(state);
		  });
      }
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    if (window.bulmaSlider) {
      bulmaSlider.attach();
    }

    const scenarioButtons = document.querySelectorAll('.qualitative-tabs .button');
    const scenarios = document.querySelectorAll('.qualitative-scenario');

    const resetScenarioVideos = (scenario) => {
      const videoButtons = scenario.querySelectorAll('.qualitative-video-tabs .button');
      const videos = scenario.querySelectorAll('.qualitative-video');

      videoButtons.forEach((btn) => btn.classList.remove('is-active'));
      videos.forEach((videoBlock) => videoBlock.classList.remove('is-active'));

      const defaultButton = scenario.querySelector('.qualitative-video-tabs .button[data-video="baseline"]')
        || scenario.querySelector('.qualitative-video-tabs .button');
      const defaultVideo = scenario.querySelector('.qualitative-video[data-video="baseline"]')
        || scenario.querySelector('.qualitative-video');

      if (defaultButton) {
        defaultButton.classList.add('is-active');
      }
      if (defaultVideo) {
        defaultVideo.classList.add('is-active');
      }
    };

    if (scenarioButtons.length && scenarios.length) {
      scenarioButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const targetId = button.getAttribute('data-scenario');

          scenarioButtons.forEach((btn) => btn.classList.remove('is-active'));
          scenarios.forEach((scenario) => {
            scenario.classList.remove('is-active');
            scenario.querySelectorAll('video').forEach((video) => {
              video.pause();
              video.currentTime = 0;
            });
          });

          button.classList.add('is-active');
          const target = document.getElementById(targetId);
          if (target) {
            target.classList.add('is-active');
            resetScenarioVideos(target);
          }
        });
      });
    }

    const videoTabGroups = document.querySelectorAll('.qualitative-video-tabs');
    if (videoTabGroups.length) {
      videoTabGroups.forEach((tabGroup) => {
        const buttons = tabGroup.querySelectorAll('.button');
        const scenario = tabGroup.closest('.qualitative-scenario');
        const videos = scenario ? scenario.querySelectorAll('.qualitative-video') : [];

        buttons.forEach((button) => {
          button.addEventListener('click', () => {
            const targetVideo = button.getAttribute('data-video');

            buttons.forEach((btn) => btn.classList.remove('is-active'));
            videos.forEach((videoBlock) => {
              videoBlock.classList.remove('is-active');
              videoBlock.querySelectorAll('video').forEach((video) => {
                video.pause();
                video.currentTime = 0;
              });
            });

            button.classList.add('is-active');
            const target = scenario ? scenario.querySelector(`.qualitative-video[data-video="${targetVideo}"]`) : null;
            if (target) {
              target.classList.add('is-active');
            }
          });
        });
      });
    }

})
