# SharePal Clone

A responsive, client-side web application replicating the core shopping and rental catalog experience of [SharePal](https://www.sharepal.in). Built with vanilla HTML5, CSS3, and JavaScript, this project showcases interactive product listings, category-based filtering, and dynamic DOM manipulation powered by local JSON data.

---

## 🚀 Features

- **Dynamic Catalog Rendering**: Loads and populates rental products dynamically from structured JSON/JavaScript data files.
- **Category Filtering & Search**: Filter products seamlessly across rental categories (e.g., trekking gear, cameras, gaming consoles, riding gear).
- **Responsive Layout**: Mobile-first grid design styled with modern CSS flexbox and grid layouts for smooth viewing across desktop, tablet, and mobile screens.
- **Cart & Selection State**: Interactive buttons for selecting rental periods or adding items to a rental cart.
- **Clean Vanilla Architecture**: Zero framework dependencies—built entirely using native Web APIs.

---

## 🛠️ Tech Stack

- **Markup**: HTML5 (Semantic Structure)
- **Styling**: CSS3 (Modern Flexbox, CSS Grid, Custom Properties/Variables)
- **Scripting**: JavaScript (ES6+ DOM manipulation, Event delegation, Fetch/Data parsing)
- **Data Source**: Local JSON / Object mock storage (`products.json`, `data.js`)

---

## 📂 Project Structure

```text
sharepal-clone/
├── index.html       # Primary application layout and markup
├── styles.css       # Complete stylesheet (responsive grid, cards, UI components)
├── app.js           # Core UI logic, state management, and DOM handlers
├── data.js          # In-memory datasets / fallback catalogs
├── products.json    # Catalog data (titles, rental rates, tags, image URLs)
└── README.md        # Project documentation
