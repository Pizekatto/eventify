import { Swiper, Autoplay} from 'swiper/js/swiper.esm'
// import easing from 'bezier-easing'

Swiper.use([Swiper, Autoplay])

const slider = document.getElementById('slider')
const control = document.getElementById('control')
const scale = document.getElementById('scale')
const delay = 2000
const circleLength = 302

const animate = async ({ easing, draw, duration }) => {
  await new Promise(resolve => {
    let start = performance.now()
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration
      if (timeFraction > 1) timeFraction = 1
      let progress = easing(timeFraction)
      draw(progress)
      if (timeFraction < 1 && swiper.autoplay.running) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    })
  })
}

const draw = progress => {
  const level = circleLength
  let result = level - progress * level
  scale.style.strokeDashoffset = result
}

const swiper = new Swiper(slider, {
  init: false,
  speed: 1200,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false
  },
  slidesPerView: 2,
  loop: true,
  breakpoints: {
    576: {
      slidesPerView: 3
    },
    992: {
      slidesPerView: 4
    }
  }
})

swiper.on('init', togglePlay)
swiper.init()
swiper.autoplay.stop()

const togglePlay = () => {
  control.classList.toggle('play', !swiper.autoplay.running)
}

const sliderObserver = () => {

  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        swiper.autoplay.start()
        console.log("Autoplay start");
        observer.disconnect()
      }
    })
  }

  const observer = new IntersectionObserver(callback)
  observer.observe(document.getElementById('slider'))
}

slider.addEventListener('click', event => {
  if (event.target.closest('#control')) {
    if (swiper.autoplay.running) {
      swiper.autoplay.stop()
      console.log("swiper.autoplay.stop");
      scale.style.strokeDashoffset = circleLength
    } else {
      swiper.autoplay.start()
    }
    togglePlay()
  }
})

swiper.on('slideChangeTransitionEnd', async () => {
  await animate({
    duration: delay,
    easing: timeFraction => timeFraction,
    draw
  })
  scale.style.strokeDashoffset = circleLength
})

sliderObserver()


