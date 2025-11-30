/*HEADER*/

// get both pupils
const pupils = document.querySelectorAll(".eye .pupil");
window.addEventListener("mousemove", (e) => {
  pupils.forEach((pupil) => {
    // get x and y postion of cursor
    var rect = pupil.getBoundingClientRect();
    var x = (e.pageX - rect.left) / 98 + "px";
    var y = (e.pageY - rect.top) / 98 + "px";
    pupil.style.transform = "translate3d(" + x + "," + y + ", 0px)";
  });
});

/*TABS*/

function openTabs(tabsName) {
  var i;
  var x = document.getElementsByClassName("tabs");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabsName).style.display = "block";
}

/*COUNTER*/

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var site_data = JSON.parse(this.responseText);
    var num_arr = site_data.info.views.toString().split("");
    var num_str = "";
    for (i = 0; i < num_arr.length; i++) {
      num_str += num_arr[i];
      if ((num_arr.length - 1 - i) % 3 == 0 && num_arr.length - 1 - i != 0) {
        num_str += ",";
      }
      var date_str = site_data.info.last_updated;
      var date_obj = new Date(site_data.info.last_updated);
      document.getElementById("lastupdate").innerHTML =
        date_obj.getMonth() +
        1 +
        "-" +
        date_obj.getDate() +
        "-" +
        date_obj.getFullYear();
    }
    document.getElementById("hitcount").innerHTML = num_str;
  }
};
xhttp.open(
  "GET",
  "https://weirdscifi.ratiosemper.com/neocities.php?sitename=hell-mouth",
  true
);
xhttp.send();

/*GOOGLE BOOKS EMBEDDED VIEWER API*/

// Configuration for book previews
const BOOK_CONFIG = {
  // Classic Literature
  "ulysses": "ISBN:0192834649",
  "scarlet": "ISBN:0142437263",
  "dubliners": "ISBN:0140186476",
  "tess": "ISBN:0141439599",
  "bovary": "ISBN:1904633099",
  "jungle": "ISBN:0252014804",
  // Contemporary Literature
  "handmaid": "ISBN:0547345666",
  "beloved": "ISBN:1400033411",
  "bluest": "ISBN:0307278441",
  "caged": "ISBN:1588369250",
  "mockingbird": "ISBN:0062368680",
  "lolita": "ISBN:0679723161"
};

let currentViewer = null;
let previewTimeout = null;

// Initialize Google Books API
function initGoogleBooks() {
  console.log("Loading Google Books API...");
  
  // Check if API is already loaded
  if (typeof google !== 'undefined' && google.books) {
    console.log("Google Books API already loaded");
    setupBookHovers();
    return;
  }
  
  // Load the API script
  const script = document.createElement('script');
  script.src = 'https://www.google.com/books/jsapi.js';
  script.onload = function() {
    console.log("Google Books script loaded");
    google.books.load();
    
    // Wait a moment for the API to initialize
    setTimeout(function() {
      console.log("Initializing book hovers");
      setupBookHovers();
    }, 500);
  };
  script.onerror = function() {
    console.error("Failed to load Google Books API");
  };
  document.head.appendChild(script);
}

// Setup hover events on book covers
function setupBookHovers() {
  // Handle book links (for pages with links)
  const bookLinks = document.querySelectorAll('.book-row a');
  console.log("Found " + bookLinks.length + " book links");
  
  bookLinks.forEach(function(link, index) {
    const href = link.getAttribute('href');
    let bookId = null;
    
    // Determine which book this is based on the URL
    if (href.includes('4300')) bookId = 'ulysses';
    else if (href.includes('25344')) bookId = 'scarlet';
    else if (href.includes('2814')) bookId = 'dubliners';
    else if (href.includes('110')) bookId = 'tess';
    else if (href.includes('2413')) bookId = 'bovary';
    else if (href.includes('140')) bookId = 'jungle';
    
    if (bookId && BOOK_CONFIG[bookId]) {
      console.log("Setting up hover for: " + bookId);
      
      link.addEventListener('mouseenter', function(e) {
        console.log("Mouse entered: " + bookId);
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(function() {
          showPreview(bookId, e);
        }, 300);
      });
      
      link.addEventListener('mouseleave', function() {
        console.log("Mouse left: " + bookId);
        clearTimeout(previewTimeout);
        setTimeout(hidePreview, 200);
      });
    }
  });
  
  // Handle standalone book covers (for pages without links)
  const bookCovers = document.querySelectorAll('.book-row img.book-cover');
  console.log("Found " + bookCovers.length + " book cover images");
  
  bookCovers.forEach(function(img) {
    const alt = img.getAttribute('alt');
    let bookId = null;
    
    // Determine which book this is based on the alt text or filename
    if (alt.includes("Handmaid")) bookId = 'handmaid';
    else if (alt.includes("Beloved")) bookId = 'beloved';
    else if (alt.includes("Bluest Eye")) bookId = 'bluest';
    else if (alt.includes("Caged Bird")) bookId = 'caged';
    else if (alt.includes("Mocking")) bookId = 'mockingbird';
    else if (alt.includes("Lolita")) bookId = 'lolita';
    
    if (bookId && BOOK_CONFIG[bookId]) {
      console.log("Setting up hover for image: " + bookId);
      
      // Make the image look interactive
      img.style.cursor = 'pointer';
      img.style.transition = 'transform 0.2s';
      
      img.addEventListener('mouseenter', function(e) {
        console.log("Mouse entered: " + bookId);
        img.style.transform = 'translateY(-5px)';
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(function() {
          showPreview(bookId, e);
        }, 300);
      });
      
      img.addEventListener('mouseleave', function() {
        console.log("Mouse left: " + bookId);
        img.style.transform = 'translateY(0)';
        clearTimeout(previewTimeout);
        setTimeout(hidePreview, 200);
      });
    }
  });
}

// Show book preview
function showPreview(bookId, event) {
  console.log("Showing preview for: " + bookId);
  
  // Remove existing preview
  hidePreview();
  
  // Create preview container
  const container = document.createElement('div');
  container.id = 'google-book-preview';
  container.style.cssText = `
    position: fixed;
    width: 500px;
    height: 600px;
    background: white;
    border: 4px solid #8b1a1a;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 10000;
    border-radius: 4px;
    overflow: hidden;
  `;
  
  // Position near cursor but keep in viewport
  let x = event.clientX + 20;
  let y = event.clientY - 100;
  
  if (x + 520 > window.innerWidth) x = window.innerWidth - 520;
  if (y + 620 > window.innerHeight) y = window.innerHeight - 620;
  if (x < 10) x = 10;
  if (y < 10) y = 10;
  
  container.style.left = x + 'px';
  container.style.top = y + 'px';
  
  // Add loading message
  container.innerHTML = '<div style="padding: 20px; text-align: center; color: #8b1a1a; font-family: serif;">Loading preview...</div>';
  
  document.body.appendChild(container);
  
  // Keep the preview open when hovering over it
  container.addEventListener('mouseenter', function() {
    console.log("Mouse entered preview - staying open");
    clearTimeout(previewTimeout);
    container.setAttribute('data-hover', 'true');
  });
  
  container.addEventListener('mouseleave', function() {
    console.log("Mouse left preview - will hide");
    container.removeAttribute('data-hover');
    previewTimeout = setTimeout(hidePreview, 200);
  });
  
  // Initialize the viewer
  try {
    if (typeof google !== 'undefined' && google.books && google.books.DefaultViewer) {
      currentViewer = new google.books.DefaultViewer(container);
      currentViewer.load(BOOK_CONFIG[bookId], function() {
        console.log("Preview loaded successfully");
      });
    } else {
      console.error("Google Books API not available");
      container.innerHTML = '<div style="padding: 20px; text-align: center; color: #8b1a1a;">Preview unavailable</div>';
    }
  } catch (error) {
    console.error("Error loading preview:", error);
    container.innerHTML = '<div style="padding: 20px; text-align: center; color: #8b1a1a;">Error loading preview</div>';
  }
}

// Hide preview (only if not being hovered)
function hidePreview() {
  const container = document.getElementById('google-book-preview');
  if (container) {
    // Don't hide if mouse is currently over the preview
    if (container.getAttribute('data-hover') === 'true') {
      console.log("Not hiding - mouse is over preview");
      return;
    }
    console.log("Hiding preview");
    container.remove();
    currentViewer = null;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, checking for book covers...");
    if (document.querySelector('.book-row')) {
      initGoogleBooks();
    }
  });
} else {
  console.log("DOM already loaded, checking for book covers...");
  if (document.querySelector('.book-row')) {
    initGoogleBooks();
  }
}

// Also hide on scroll
window.addEventListener('scroll', function() {
  clearTimeout(previewTimeout);
  hidePreview();
});
