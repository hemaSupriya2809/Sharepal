# SharePal - Gaming Gadgets on Rent (Frontend Clone)

A pixel-perfect, fully responsive frontend recreation of the SharePal Bangalore Gaming Gadgets rental page. Built using pure HTML5, CSS3, and Vanilla JavaScript with no external heavy frameworks to ensure maximum performance and a clean, maintainable architecture.

## 🚀 Live Demo Instructions
Simply open `index.html` in any modern web browser. No build steps, dependencies, or servers are required.

## ✨ Creative Improvements (UX Enhancements)

While maintaining strict adherence to SharePal's existing design system and visual language, I implemented several interactive UX improvements to demonstrate product-thinking and advanced frontend capabilities:

1. **Dynamic Rental Pricing Engine**: 
   Instead of static price text, I integrated a fully functional date picker. When a user selects a Delivery and Pickup date, the application calculates the total rental days and dynamically updates the prices on all product cards in real-time.
   
2. **Live Search Filtering**: 
   Added a real-time search modal that instantly filters the product grid based on user input (e.g., typing "PS5" instantly narrows down the grid).

3. **Interactive Cart Drawer**: 
   A fully functional cart system utilizing JavaScript `Set` logic. Users can add/remove items, and the cart dynamically calculates the total payable amount based on the selected rental duration.

4. **Multi-step Authentication Flow**: 
   Replaced basic login buttons with a realistic 2-step OTP authentication simulation (Mobile Number -> Send OTP -> Verify), demonstrating form validation and state management.

5. **Support Chatbot Widget**: 
   Added an interactive, animated support chatbot in the bottom right corner. This improves the UX by offering immediate simulated help for rental policies or issues.

6. **Skeleton Loading States**: 
   Implemented modern CSS-only skeleton loaders for the product grid to simulate network fetching, significantly improving the perceived performance and modern feel of the application.

7. **Side-by-Side Product Comparison**:
   Added a product-focused "Compare" feature allowing users to select any two consoles and view a clean side-by-side spec comparison (Resolution, Storage, Controllers, Price) to help drive faster rental decisions.

8. **Progressive Web App (PWA) Integration**:
   Implemented a `manifest.json`, local SVG icons, and a Service Worker (`sw.js`). This enables basic caching capabilities and prompts mobile users to "Install" the web app directly to their home screen as a native-feeling application.

9. **Dynamic Dark Mode Toggle**:
   Architected a scalable CSS Custom Properties (CSS variables) system to allow users to toggle seamlessly between a light theme and a sleek dark theme. User preferences are persisted via `localStorage`.

## 🛠 Tech Stack
* **HTML5**: Semantic markup, native `<dialog>` elements for accessibility.
* **CSS3**: CSS Variables for theming, Flexbox/Grid for responsive layouts, and pure CSS keyframe animations.
* **Vanilla JavaScript (ES6+)**: Modular event delegation, state management, and DOM manipulation without the overhead of React/Vue.
