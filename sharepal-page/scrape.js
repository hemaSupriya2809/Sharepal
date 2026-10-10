const fs = require('fs');

fetch('https://sharepal.in/bangalore/gaming-gadgets-on-rent')
  .then(r => r.text())
  .then(html => {
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(\{.*?\})<\/script>/);
    if (!match) return console.log("No Next.js data found.");
    
    const data = JSON.parse(match[1]);
    let products = [];
    
    try {
      // Find where products are stored
      const queries = data.props.pageProps.dehydratedState.queries;
      for (const q of queries) {
        if (q.state && q.state.data && q.state.data.products) {
          products = q.state.data.products;
          break;
        }
      }
    } catch(e) {}
    
    if(!products.length) {
       console.log(Object.keys(data.props.pageProps));
       console.log("Couldn't extract products from the state. Will try alternative path.");
       return;
    }
    
    console.log(`Found ${products.length} products!`);
    
    const cleanProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image_url || (p.images && p.images[0]) || p.image,
      rating: p.rating || 0,
      booked_count: p.booked_count || 0,
      tag: p.tag_name || p.tag || "",
      per_day_rent: p.per_day_rent || p.price || 0,
      out_of_stock: p.out_of_stock || false
    }));
    
    const jsContent = `window.PRODUCTS = ${JSON.stringify({ products: cleanProducts }, null, 2)};`;
    fs.writeFileSync('data.js', jsContent);
    console.log('Successfully updated data.js with all products!');
  })
  .catch(console.error);
