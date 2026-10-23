/* =====================================================
   Seif Sharaf - Portfolio
   Only "var" and normal functions are used here.
   Every feature has its own small section.
   ===================================================== */

var htmlElement = document.documentElement;

/* ---------------------------------------------------
   1. Settings: default values, save and load
   --------------------------------------------------- */

// The first look of the website (also used by the reset button)
var defaultMode = "dark";
var defaultFont = "Tajawal";
var defaultMainColor = "#6366f1";
var defaultSecondColor = "#a855f7";

// The current choices of the visitor
var currentMode = defaultMode;
var currentFont = defaultFont;
var currentMainColor = defaultMainColor;
var currentSecondColor = defaultSecondColor;

// Save the choices in the browser, so they stay after refreshing the page
function saveSettings() {
  try {
    localStorage.setItem("siteMode", currentMode);
    localStorage.setItem("siteFont", currentFont);
    localStorage.setItem("siteMainColor", currentMainColor);
    localStorage.setItem("siteSecondColor", currentSecondColor);
  } catch (error) {
    // If the browser blocks saving, the website still works normally
  }
}

// Read the saved choices (if there are any)
function loadSettings() {
  try {
    currentMode = localStorage.getItem("siteMode") || defaultMode;
    currentFont = localStorage.getItem("siteFont") || defaultFont;
    currentMainColor =
      localStorage.getItem("siteMainColor") || defaultMainColor;
    currentSecondColor =
      localStorage.getItem("siteSecondColor") || defaultSecondColor;
  } catch (error) {
    // If reading fails, we keep the default values
  }
}

/* ---------------------------------------------------
   2. Dark / Light mode
   Dark mode  = the "dark" class is on the <html> element
   Light mode = the "dark" class is removed
   --------------------------------------------------- */

var themeSwitch = document.getElementById("themeSwitch");
var themeIcon = document.getElementById("themeIcon");

function applyMode(mode) {
  if (mode === "dark") {
    htmlElement.classList.add("dark");
    themeIcon.className = "fa-solid fa-moon";
  } else {
    htmlElement.classList.remove("dark");
    themeIcon.className = "fa-solid fa-sun";
  }
}

function changeMode() {
  if (htmlElement.classList.contains("dark")) {
    currentMode = "light";
  } else {
    currentMode = "dark";
  }

  applyMode(currentMode);
  saveSettings();
}

themeSwitch.addEventListener("click", changeMode);

/* ---------------------------------------------------
   3. Active link in the navbar (changes while scrolling)
   --------------------------------------------------- */

var allSections = document.querySelectorAll("main section[id]");
var menuLinks = document.querySelectorAll(".menu-link");
var mainMenu = document.getElementById("mainMenu");

function updateActiveLink() {
  // We look a little below the header, so the change feels natural
  var scrollPosition = window.scrollY + 120;
  var currentId = "home";

  // Find the last section that we already passed
  for (var i = 0; i < allSections.length; i++) {
    if (allSections[i].offsetTop <= scrollPosition) {
      currentId = allSections[i].id;
    }
  }

  // At the very end of the page, the last link should be active
  var reachedBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;
  if (reachedBottom) {
    currentId = "contact";
  }

  // Give the "active" class only to the link of the current section.
  // A section without a link (like skills) leaves all links not active.
  for (var j = 0; j < menuLinks.length; j++) {
    if (menuLinks[j].getAttribute("href") === "#" + currentId) {
      menuLinks[j].classList.add("active");
    } else {
      menuLinks[j].classList.remove("active");
    }
  }
}

// On phones: close the menu after clicking a link
function closeMobileMenu() {
  if (mainMenu.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(mainMenu).hide();
  }
}

for (var k = 0; k < menuLinks.length; k++) {
  menuLinks[k].addEventListener("click", closeMobileMenu);
}

/* ---------------------------------------------------
   4. Skill bars (they fill when the section appears)
   --------------------------------------------------- */

var skillBars = document.querySelectorAll(".skill-fill");
var skillsSection = document.getElementById("skills");

function fillSkillBars(entries) {
  if (entries[0].isIntersecting) {
    for (var i = 0; i < skillBars.length; i++) {
      skillBars[i].style.width = skillBars[i].getAttribute("data-level") + "%";
    }
    skillsObserver.disconnect();
  }
}

var skillsObserver = new IntersectionObserver(fillSkillBars, {
  threshold: 0.2,
});
skillsObserver.observe(skillsSection);

/* ---------------------------------------------------
   5. Portfolio tabs (our own tabs, not Bootstrap tabs)
   --------------------------------------------------- */

var tabButtons = document.querySelectorAll(".tab-button");
var projectItems = document.querySelectorAll(".project-item");

// Show only the projects of the chosen category
function filterProjects(category) {
  for (var i = 0; i < projectItems.length; i++) {
    var projectCategory = projectItems[i].getAttribute("data-category");

    if (category === "all" || projectCategory === category) {
      projectItems[i].classList.remove("is-hidden");
    } else {
      projectItems[i].classList.add("is-hidden");
    }
  }
}

// Make the clicked tab the active one
function chooseTab(clickedTab) {
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  clickedTab.classList.add("active");
  filterProjects(clickedTab.getAttribute("data-filter"));
}

for (var t = 0; t < tabButtons.length; t++) {
  // A small helper function keeps the correct button for each click
  addTabClick(tabButtons[t]);
}

function addTabClick(button) {
  button.addEventListener("click", function () {
    chooseTab(button);
  });
}

/* ---------------------------------------------------
   6. Testimonials slider
   Phones: 1 card - Tablets: 2 cards - Desktop: 3 cards
   --------------------------------------------------- */

var sliderTrack = document.getElementById("sliderTrack");
var sliderItems = document.querySelectorAll(".slider-item");
var sliderPrev = document.getElementById("sliderPrev");
var sliderNext = document.getElementById("sliderNext");
var sliderDots = document.getElementById("sliderDots");

var currentSlide = 0;

// How many cards are visible now (same screen sizes as the CSS)
function getVisibleCards() {
  if (window.innerWidth >= 992) {
    return 3;
  }
  if (window.innerWidth >= 768) {
    return 2;
  }
  return 1;
}

// The last position the slider can stop at
function getLastSlide() {
  return sliderItems.length - getVisibleCards();
}

// Create one dot for each position
function createDots() {
  sliderDots.innerHTML = "";

  for (var i = 0; i <= getLastSlide(); i++) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", "الشريحة رقم " + (i + 1));
    addDotClick(dot, i);
    sliderDots.appendChild(dot);
  }
}

function addDotClick(dot, slideNumber) {
  dot.addEventListener("click", function () {
    goToSlide(slideNumber);
  });
}

// Move the slider to a position
function goToSlide(slideNumber) {
  var lastSlide = getLastSlide();

  // After the last slide we go back to the first one, and the opposite
  if (slideNumber > lastSlide) {
    slideNumber = 0;
  }
  if (slideNumber < 0) {
    slideNumber = lastSlide;
  }

  currentSlide = slideNumber;

  // The website is RTL, so a positive value moves the track to the right
  var moveBy = currentSlide * (100 / getVisibleCards());
  sliderTrack.style.transform = "translateX(" + moveBy + "%)";

  // Mark the correct dot as active
  var allDots = document.querySelectorAll(".slider-dot");
  for (var i = 0; i < allDots.length; i++) {
    if (i === currentSlide) {
      allDots[i].classList.add("active");
    } else {
      allDots[i].classList.remove("active");
    }
  }
}

function showNextSlide() {
  goToSlide(currentSlide + 1);
}

function showPreviousSlide() {
  goToSlide(currentSlide - 1);
}

sliderNext.addEventListener("click", showNextSlide);
sliderPrev.addEventListener("click", showPreviousSlide);

// Swipe with the finger on phones
var touchStartX = 0;

function saveTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function checkSwipe(event) {
  var distance = event.changedTouches[0].clientX - touchStartX;

  // A very small movement is not a swipe
  if (distance > -50 && distance < 50) {
    return;
  }

  // Dragging to the right shows the next card (because of RTL)
  if (distance > 0) {
    showNextSlide();
  } else {
    showPreviousSlide();
  }
}

sliderTrack.addEventListener("touchstart", saveTouchStart);
sliderTrack.addEventListener("touchend", checkSwipe);

// When the screen size changes, the number of dots can change too
function fixSliderOnResize() {
  createDots();

  if (currentSlide > getLastSlide()) {
    currentSlide = getLastSlide();
  }

  goToSlide(currentSlide);
}

window.addEventListener("resize", fixSliderOnResize);

/* ---------------------------------------------------
   7. Settings sidebar (gear icon)
   --------------------------------------------------- */

var openSettingsButton = document.getElementById("openSettings");
var closeSettingsButton = document.getElementById("closeSettings");
var settingsPanel = document.getElementById("settingsPanel");
var settingsOverlay = document.getElementById("settingsOverlay");
var fontCards = document.querySelectorAll(".font-card");
var colorDots = document.querySelectorAll(".color-dot");
var resetButton = document.getElementById("resetSettings");

function openSettings() {
  settingsPanel.classList.add("open");
  settingsOverlay.classList.add("show");
}

function closeSettings() {
  settingsPanel.classList.remove("open");
  settingsOverlay.classList.remove("show");
}

function closeSettingsWithEscape(event) {
  if (event.key === "Escape") {
    closeSettings();
  }
}

openSettingsButton.addEventListener("click", openSettings);
closeSettingsButton.addEventListener("click", closeSettings);
settingsOverlay.addEventListener("click", closeSettings);
document.addEventListener("keydown", closeSettingsWithEscape);

// ----- Change the font -----
function applyFont(fontName) {
  htmlElement.style.setProperty(
    "--main-font",
    '"' + fontName + '", sans-serif',
  );

  for (var i = 0; i < fontCards.length; i++) {
    if (fontCards[i].getAttribute("data-font") === fontName) {
      fontCards[i].classList.add("active");
    } else {
      fontCards[i].classList.remove("active");
    }
  }
}

function addFontClick(card) {
  card.addEventListener("click", function () {
    currentFont = card.getAttribute("data-font");
    applyFont(currentFont);
    saveSettings();
  });
}

for (var f = 0; f < fontCards.length; f++) {
  addFontClick(fontCards[f]);
}

// ----- Change the theme color -----
function applyColor(mainColor, secondColor) {
  htmlElement.style.setProperty("--primary", mainColor);
  htmlElement.style.setProperty("--secondary", secondColor);

  for (var i = 0; i < colorDots.length; i++) {
    if (colorDots[i].getAttribute("data-main") === mainColor) {
      colorDots[i].classList.add("active");
    } else {
      colorDots[i].classList.remove("active");
    }
  }
}

function addColorClick(dot) {
  dot.addEventListener("click", function () {
    currentMainColor = dot.getAttribute("data-main");
    currentSecondColor = dot.getAttribute("data-second");
    applyColor(currentMainColor, currentSecondColor);
    saveSettings();
  });
}

for (var c = 0; c < colorDots.length; c++) {
  addColorClick(colorDots[c]);
}

// ----- Put everything back to the first look -----
function resetSettings() {
  currentMode = defaultMode;
  currentFont = defaultFont;
  currentMainColor = defaultMainColor;
  currentSecondColor = defaultSecondColor;

  applyMode(currentMode);
  applyFont(currentFont);
  applyColor(currentMainColor, currentSecondColor);
  saveSettings();
}

resetButton.addEventListener("click", resetSettings);

/* ---------------------------------------------------
   8. Scroll to top button
   --------------------------------------------------- */

var topButton = document.getElementById("topButton");

// Show the button only after scrolling down
function toggleTopButton() {
  if (window.scrollY > 400) {
    topButton.classList.add("show");
  } else {
    topButton.classList.remove("show");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

topButton.addEventListener("click", scrollToTop);

/* ---------------------------------------------------
   9. Contact form (shows a thank you message)
   --------------------------------------------------- */

var contactForm = document.getElementById("contactForm");
var formMessage = document.getElementById("formMessage");

function clearFormMessage() {
  formMessage.textContent = "";
}

function sendForm(event) {
  event.preventDefault();

  formMessage.textContent = "وصلت رسالتك بنجاح، هرد عليك في أقرب وقت!";
  contactForm.reset();

  setTimeout(clearFormMessage, 5000);
}

contactForm.addEventListener("submit", sendForm);

/* ---------------------------------------------------
   10. Start everything
   --------------------------------------------------- */

function onPageScroll() {
  updateActiveLink();
  toggleTopButton();
}

window.addEventListener("scroll", onPageScroll);

loadSettings();
applyMode(currentMode);
applyFont(currentFont);
applyColor(currentMainColor, currentSecondColor);
createDots();
goToSlide(0);
updateActiveLink();
toggleTopButton();
