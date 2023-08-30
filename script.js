'use strict';

// ///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');

//function for opening modal when we press the green button
const openModal = function (e) {
  // stopping the page from going to the top when we open the modal and reloading
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// event that opens modal when you click on the green account buttons
for (const btn of btnsOpenModal) btn.addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// NAVBAR TOGGLE
// selecting toggle btna and nav links container
const toggleBtn = document.querySelector('.toggle-button');
const navLinks = document.querySelector('.nav__links');
// add active class
toggleBtn.addEventListener('click', function () {
  toggleBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// COOKIE POPUP`
// creating a div (which will be the cookie popup)
const message = document.createElement('div');
// adding the cookie class
message.classList.add('message');
message.innerHTML =
  'We use cookies for improved functionality and analytics <button class="btn btn--close--cookie">Got it!</button>';
// adding the element to the dom (append adds it as the last child of the header)
header.append(message);
// closing the cookie mesg when button is clicked
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
  });
message.style.backgroundColor = '#37383d';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// IMPLEMENTING SMOOTH SCROLL FOR 'learn more' BUTTON
// selecting elements
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// PAGE NAVIGATION (scrolling to a section when we click a link on the navbar)
// EASIER WAY TO DO THIS IS USING CSS (scroll-behaviour:smooth;)
// Add event listener to common parent and detetmine which element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matcing strategy
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    //  getting the href of the link and using it as a selector for scrolling
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
  // removing nav bar when and toggle btn
  if (toggleBtn.classList.contains('active')) {
    toggleBtn.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// BUILDING TABBED COMPONENT (3 COLORED BUTTON ON OPERATIONS PAGE)
// selecting the three tabs, the tab container and the content
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// adding an event listener to the parent element of all the tabs so we dont have to have many event listeners
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // guard clause (returns if nothing is clicked so we dont get error)
  if (!clicked) return;
  // removing active class from all tabs then giving active class to the tab that is clicked
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // removing already active classes and activating content area based on the data-tab attribute
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// NAVBAR FADE ANIMATION
const nav = document.querySelector('.nav');
// function to handle hovering over nav links
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // selecting the target link, sibling links and logo
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // changing opacity of sibling and logo links ('this' refers to the opacity that is passed in the bind method)
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    }, this);
    logo.style.opacity = this;
  }
};

// pass opacity as an argument using the bind method
// when hovering over a link:
nav.addEventListener('mouseover', handleHover.bind(0.5));
// when you stop hovering over a link
nav.addEventListener('mouseout', handleHover.bind(1));

// IMPLEMENTING STICKY NAVIGATOR USING INTERSECTION OBSERVER API
const navHeight = nav.getBoundingClientRect().height;
// this function adds a sticky nav when the header isnt intersecting the viewport else it removes the sticky nav
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // null means the whole viewport
  threshold: 0, // intersection percentage at which the above function would be called
  rootMargin: `-${navHeight}px`, // rootMargin is number of pixels to add or remove from target element (header)
});
// selecting the element to be observered (header which is the main page on the website)
headerObserver.observe(header);

// REVEALING ELEMENTS ON SCROLL
// selecting all the sections that are gonna be observed
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // removing the hidden class from the entry object
  if (!entry.isIntersecting) return;
  else entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //stop observing the sections after they have already been unhidden
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOADING IMAGES (only loading the images when the user gets to them)
// selecting all the images that contain the data-src attribute
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // replace src with data-src
    entry.target.src = entry.target.dataset.src;
    // we have to listen to a load event or else if the connection is poor, blurry images will be shown until the server gets the clear images
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // so the user doest have to wait for the loading right at the intersection
});

imgTargets.forEach(img => imageObserver.observe(img));

// GO TO TOP OF PAGE WHENEVER IT IS RELOADED
const topOfPage = function () {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
};

// SLIDER COMPONENT
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  // setting the current slide number to 0
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  // sliding using dots
  const dotContainer = document.querySelector('.dots');
  //function for creating a dot for each of the slides
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  // changing color of the dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active')); // removing all active classes
    // adding active class
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  // function that changes the transform style property whenever the next or previous arrows are pressed
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // function to go to the next slide (right)
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // function to go to previous slide (left)
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // initialization function
  const init = function () {
    // this sets the original position of the slides (0%, 100%, 200%)
    goToSlide(0);
    // create dots
    createDots();
    // removes all active classes and activates class for first dot
    activateDot(0);
    //scroll back to the top of page whenever you reload
    topOfPage();
  };

  init();

  // Event Handlers
  // go to next and previous slides
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // sliding using keyboard arrows
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
// calling the whole slider function
slider();
