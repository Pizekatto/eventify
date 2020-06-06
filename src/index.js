import './styles/main.sass'
import smoothscroll from 'smoothscroll-polyfill'
import {LoremIpsum} from 'lorem-ipsum'
import capitalize from 'lorem-ipsum/dist/util/capitalize'

smoothscroll.polyfill()
const loremInstance = new LoremIpsum()
const lorem = (n) => {
  return capitalize(loremInstance.generateWords(n))
}


const xsResolution = 576
const mediaUpSM = "(min-width: 576px)"
let isSticky = false
const navbar = document.getElementById('navbar')
const logo = {
  element: document.getElementById('image-logo'),
  src: {
    white: './assets/images/logo.png',
    noTextWhite: './assets/images/logo-sm.png'
  }
}
const sections = [
  'home', 'shedules', 'speakers', 'gallery', 'pricing', 'contact'
]
const sectionsElements = sections.map((section) => {
  return document.getElementById(section)
})
const sectionElementsWithID = {}
sectionsElements.forEach(elem => {
  Object.assign(sectionElementsWithID, { [elem.id]: elem })
})
const navbarLinks = navbar.querySelectorAll(`a[href^="#"]`)
const navbarLinksWithHash = new Map()
navbarLinks.forEach(link => {
  navbarLinksWithHash.set(link, new URL(link.href).hash.slice(1))
})

const changeLogo = (state) => {
  if (window.innerWidth < xsResolution) {
    logo.element.src = state ? logo.src.noTextWhite : logo.src.white
  } else {
    logo.element.src = logo.src.white
  }
}

const stickyObserver = () => {
  const observable = document.getElementById('observable')

  const options = {
    rootMargin: '-70px 0px 0px 0px',
  }

  const switchSticky = (state) => {
    isSticky = state
    navbar.classList.toggle('sticky', state)
    // false - удаляет , true - добавляет
    changeLogo(state)
  }

  const callback = (entries) => {
    entries.forEach(entry => {
      switchSticky(!entry.isIntersecting)
    })
  }

  const observer = new IntersectionObserver(callback, options)
  observer.observe(observable)
}

const sectionObserver = () => {

  const addActiveMenu = (sectionID) => {
    for (let item of navbarLinksWithHash) {
      if (item[1] === sectionID) {
        item[0].classList.add('active')
      } else if (item[0].classList.contains('active')) {
        item[0].classList.remove('active')
      }
    }
  }

  const options = {
    rootMargin: '-59% 0% -40% 0%'
  }

  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        addActiveMenu(entry.target.id)
      }
    })
  }

  const observer = new IntersectionObserver(callback, options)
  sectionsElements.forEach(element => {
    observer.observe(element)
  })
}

const navbarSmoothScroll = () => {
  navbar.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault()
      const hash = navbarLinksWithHash.get(event.target)
      const destination = sectionElementsWithID[hash]
      destination.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const loremInject = () => {
  document.querySelectorAll('[data-lorem]').forEach(elem => {
    elem.textContent = lorem(+elem.dataset.lorem)
  })
}

const getTimeRemaining = (endtime) => {
  const t = new Date(endtime) - new Date()
  const seconds = Math.floor((t / 1000) % 60)
  const minutes = Math.floor((t / 1000 / 60) % 60)
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
  const days = Math.floor(t / (1000 * 60 * 60 * 24))
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  }
}

const initializeClock = (element, endtime) => {
  const clock = element
  const daysSpan = clock.querySelector('.days')
  const hoursSpan = clock.querySelector('.hours')
  const minutesSpan = clock.querySelector('.minutes')
  const secondsSpan = clock.querySelector('.seconds')

  function updateClock() {
    const t = getTimeRemaining(endtime)

    daysSpan.textContent = t.days
    hoursSpan.textContent = t.hours
    minutesSpan.textContent = t.minutes
    secondsSpan.textContent = t.seconds

    if (t.total <= 0) {
      clearInterval(timeinterval)
    }
  }

  updateClock()
  const timeinterval = setInterval(updateClock, 1000)
}

const startDate = (daysAdd) => {
  const date = new Date()
  date.setDate(date.getDate() + daysAdd)
  return date
}

const eventFormHandler = () => {
  const form = document.getElementById('event-form')
  const tabContent = document.querySelectorAll('.tab-content')
  let previousTab

  const showTab = () => {
    const data = new FormData(form)
    if (previousTab !== undefined) {
      tabContent[previousTab-1].style.display = 'none'
    }
    for (let [, value] of data) {
      tabContent[value-1].style.display = 'block'
      previousTab = value
    }
  }
  showTab()
  form.addEventListener('change', showTab)
}


stickyObserver()
sectionObserver()
navbarSmoothScroll()
loremInject()
eventFormHandler()

const counter = document.getElementById('date-counter')
initializeClock(counter, startDate(5))

const mediaQueryListSM = window.matchMedia(mediaUpSM)
mediaQueryListSM.addEventListener("change", () => {
  changeLogo(isSticky)
})

import './slider'

