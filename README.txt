REASONLAB WEBSITES STARTER

Copy these files into the root of your existing ReasonLab project:

- websites.html
- css/websites.css
- js/websites.js
- demos/ (complete folder)

The page intentionally references your existing:
- css/style.css
- js/app.js
- assets/logo-icon.png
- assets/favicon.png
- book.html
- index.html

Recommended navigation update in index.html and book.html:
Add this link inside .navlinks:
<a href="websites.html">Websites</a>

Performance:
- The five demos are loaded only after clicking Explore Demo.
- Each demo uses one optimized Unsplash image.
- Closing the modal unloads the iframe.
- No large framework or external JavaScript library is used.
