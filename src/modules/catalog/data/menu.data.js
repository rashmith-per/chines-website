/** Seed catalogue for Dragon Pearl. Prices in INR. */

export const CATEGORIES = [
  { id: 'dim-sum', name: 'Dim Sum', cjk: '點心', blurb: 'Hand-folded, bamboo-steamed', image: 'dimsum' },
  { id: 'noodles', name: 'Noodles', cjk: '麵', blurb: 'Pulled, tossed, wok-kissed', image: 'hakka' },
  { id: 'fried-rice', name: 'Fried Rice', cjk: '飯', blurb: 'Smoky wok hei in every grain', image: 'friedRice' },
  { id: 'main-course', name: 'Main Course', cjk: '菜', blurb: 'Classics from the Canton coast', image: 'manchurian' },
  { id: 'sichuan', name: 'Sichuan Specials', cjk: '辣', blurb: 'Numbing peppercorn & chilli', image: 'prawnCurry' },
  { id: 'starters', name: 'Starters', cjk: '前', blurb: 'Crisp, golden, irresistible', image: 'friedPrawns' },
  { id: 'vegetarian', name: 'Vegetarian', cjk: '素', blurb: 'Garden-fresh Buddhist plates', image: 'vegBowl' },
  { id: 'desserts', name: 'Desserts', cjk: '甜', blurb: 'A sweet farewell', image: 'sundae' },
  { id: 'beverages', name: 'Beverages', cjk: '茶', blurb: 'Fine teas & coolers', image: 'teapot' },
]

/** KDS stations — the kitchen sees items grouped by these. */
export const STATIONS = ['Starters', 'Main Course', 'Rice', 'Noodles', 'Desserts', 'Beverages']

const item = (id, name, category, price, opts) => ({
  id,
  name,
  category,
  price,
  veg: false,
  spice: 0,
  tags: [],
  available: true,
  prepTime: 15,
  rating: 4.6,
  ...opts,
})

export const MENU_ITEMS = [
  // Dim Sum
  item('har-gow', 'Crystal Prawn Har Gow', 'dim-sum', 380, { description: 'Translucent wheat-starch parcels of sweet prawn and bamboo shoot.', image: 'dumpling', station: 'Starters', tags: ['Chef Special'], prepTime: 12, rating: 4.8 }),
  item('sui-mai', 'Chicken Sui Mai', 'dim-sum', 340, { description: 'Open-top dumplings of chicken, shiitake and ginger, steamed in bamboo.', image: 'dimsum', station: 'Starters', tags: ['Bestseller'], prepTime: 12 }),
  item('veg-crystal', 'Garden Crystal Dumplings', 'dim-sum', 290, { description: 'Water chestnut, carrot, edamame and coriander in a delicate skin.', image: 'momos', station: 'Starters', veg: true, prepTime: 12 }),
  item('chilli-wonton', 'Chilli Oil Wontons', 'dim-sum', 320, { description: 'Silky chicken wontons in house chilli oil, black vinegar and sesame.', image: 'wontonSoup', station: 'Starters', spice: 2, prepTime: 10 }),

  // Starters
  item('honey-potato', 'Crispy Honey Chilli Potato', 'starters', 260, { description: 'Twice-fried potato fingers glazed in honey, chilli and sesame.', image: 'crispyPotato', station: 'Starters', veg: true, spice: 1, tags: ['Bestseller'], prepTime: 10 }),
  item('dragon-chicken', 'Dragon Chicken', 'starters', 360, { description: 'Crackling chicken tossed with cashews, red chilli and spring onion.', image: 'friedChicken', station: 'Starters', spice: 2, prepTime: 12, rating: 4.7 }),
  item('golden-prawns', 'Golden Fried Prawns', 'starters', 480, { description: 'Tempura-crisp tiger prawns with wasabi mayo and lime.', image: 'friedPrawns', station: 'Starters', prepTime: 12 }),
  item('hot-sour-soup', 'Hot & Sour Soup', 'starters', 200, { description: 'Peppery, tangy broth with tofu, mushroom and bamboo shoots.', image: 'greensSoup', station: 'Starters', veg: true, spice: 2, prepTime: 8 }),

  // Noodles
  item('veg-hakka', 'Veg Hakka Noodles', 'noodles', 280, { description: 'Classic Hakka noodles with fresh vegetables.', image: 'hakka', station: 'Noodles', veg: true, tags: ['Signature'], prepTime: 10, rating: 4.7 }),
  item('chilli-garlic-noodles', 'Chilli Garlic Noodles', 'noodles', 300, { description: 'Wok-tossed noodles with burnt garlic, chilli flakes and scallion.', image: 'chilliNoodles', station: 'Noodles', veg: true, spice: 2, prepTime: 10 }),
  item('prawn-chow-fun', 'Prawn Chow Fun', 'noodles', 420, { description: 'Flat rice noodles, tiger prawns, bean sprouts and dark soy.', image: 'prawnNoodles', station: 'Noodles', prepTime: 12 }),
  item('singapore-noodles', 'Singapore Curry Noodles', 'noodles', 360, { description: 'Golden curried rice vermicelli with chicken, egg and peppers.', image: 'curryNoodles', station: 'Noodles', spice: 1, prepTime: 12 }),
  item('shoyu-egg-noodle', 'Soy Egg Noodle Soup', 'noodles', 360, { description: 'Slow-simmered chicken broth, marinated egg, greens and noodles.', image: 'ramenEgg', station: 'Noodles', prepTime: 14 }),

  // Fried Rice
  item('schezwan-rice', 'Schezwan Fried Rice', 'fried-rice', 320, { description: 'Fragrant rice tossed with vegetables and authentic Schezwan sauce.', image: 'friedRice', station: 'Rice', veg: true, spice: 2, tags: ['Signature'], prepTime: 10, rating: 4.7 }),
  item('garlic-rice', 'Burnt Garlic Fried Rice', 'fried-rice', 300, { description: 'Smoky wok rice with crisp garlic, egg and spring onion.', image: 'garlicRice', station: 'Rice', prepTime: 10 }),
  item('jasmine-rice', 'Steamed Jasmine Rice', 'fried-rice', 180, { description: 'Fluffy, fragrant Thai jasmine rice.', image: 'vegBowl', station: 'Rice', veg: true, prepTime: 6 }),

  // Main course
  item('kung-pao', 'Kung Pao Chicken', 'main-course', 420, { description: 'Tender chicken, peanuts, vegetables and our signature spicy sauce.', image: 'chilliChicken', station: 'Main Course', spice: 2, tags: ['Signature', 'Bestseller'], prepTime: 15, rating: 4.9 }),
  item('chicken-manchurian', 'Chicken Manchurian', 'main-course', 390, { description: 'Crispy chicken tossed in our signature Manchurian sauce.', image: 'manchurian', station: 'Main Course', spice: 1, tags: ['Signature'], prepTime: 15, rating: 4.8 }),
  item('hot-garlic-chicken', 'Chicken in Hot Garlic Sauce', 'main-course', 400, { description: 'Silky chicken in a fiery, glossy garlic and chilli sauce.', image: 'garlicChicken', station: 'Main Course', spice: 3, prepTime: 15 }),
  item('lions-head', "Lion's Head Meatballs", 'main-course', 460, { description: 'Braised Shanghai-style meatballs, napa cabbage and brown sauce.', image: 'meatballs', station: 'Main Course', prepTime: 18 }),
  item('ginger-fish', 'Steamed Fish, Ginger & Soy', 'main-course', 560, { description: 'Pan-seared basa with ginger, scallion oil and superior soy.', image: 'fish', station: 'Main Course', tags: ['Chef Special'], prepTime: 18 }),

  // Sichuan
  item('sichuan-prawns', 'Sichuan Chilli Prawns', 'sichuan', 540, { description: 'Prawns in a numbing broth of dried chillies and Sichuan pepper.', image: 'prawnCurry', station: 'Main Course', spice: 3, tags: ['Chef Special'], prepTime: 16, rating: 4.8 }),
  item('dan-dan', 'Dan Dan Noodles', 'sichuan', 340, { description: 'Chilli-sesame noodles with minced chicken and preserved greens.', image: 'sichuanNoodles', station: 'Noodles', spice: 3, prepTime: 12 }),
  item('chongqing-broth', 'Chongqing Hot Pot Noodles', 'sichuan', 380, { description: 'Fiery bone broth with hand-pulled noodles and pickled mustard.', image: 'ramenDark', station: 'Noodles', spice: 3, prepTime: 14 }),
  item('lamb-noodle-soup', 'Sichuan Lamb Noodle Soup', 'sichuan', 420, { description: 'Five-spice braised lamb, clear broth, bok choy and chilli oil.', image: 'beefSoup', station: 'Noodles', spice: 2, prepTime: 16 }),

  // Vegetarian
  item('buddhas-delight', "Buddha's Delight", 'vegetarian', 320, { description: 'Seasonal greens, tofu, lotus root and mushrooms in light soy.', image: 'vegBowl', station: 'Main Course', veg: true, prepTime: 12 }),
  item('mapo-tofu', 'Mapo Tofu', 'vegetarian', 340, { description: 'Silken tofu in a spicy, numbing broad-bean chilli sauce.', image: 'tofuCurry', station: 'Main Course', veg: true, spice: 3, prepTime: 12, rating: 4.7 }),
  item('bok-choy-broth', 'Bok Choy Noodle Broth', 'vegetarian', 300, { description: 'Clear mushroom broth, bok choy, tofu puffs and rice noodles.', image: 'greensSoup', station: 'Noodles', veg: true, prepTime: 12 }),

  // Desserts
  item('wonton-sundae', 'Chocolate Wonton Sundae', 'desserts', 260, { description: 'Crisp chocolate wontons, vanilla bean ice cream and fudge.', image: 'sundae', station: 'Desserts', veg: true, tags: ['Bestseller'], prepTime: 6 }),
  item('sesame-macarons', 'Black Sesame Macarons', 'desserts', 240, { description: 'Matcha, black sesame and lychee-rose macarons.', image: 'macarons', station: 'Desserts', veg: true, prepTime: 4 }),

  // Beverages
  item('jasmine-tea', 'Jasmine Pearl Tea', 'beverages', 180, { description: 'Hand-rolled jasmine pearls, served in a clay pot.', image: 'teapot', station: 'Beverages', veg: true, prepTime: 4 }),
  item('lemongrass-iced-tea', 'Lemongrass Iced Tea', 'beverages', 190, { description: 'Cold-brewed oolong, lemongrass, lime and honey.', image: 'icedTea', station: 'Beverages', veg: true, prepTime: 3 }),
  item('chrysanthemum-tea', 'Chrysanthemum Green Tea', 'beverages', 170, { description: 'Floral, cooling and caffeine-light.', image: 'greenTea', station: 'Beverages', veg: true, prepTime: 4 }),
]

export const SIGNATURE_IDS = ['kung-pao', 'schezwan-rice', 'veg-hakka', 'chicken-manchurian']
