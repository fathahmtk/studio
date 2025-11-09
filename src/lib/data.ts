import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';

// This file is now primarily for seeding data if the collections are empty.

const { firestore } = initializeFirebase();

const seedIngredients = [
  { id: 'flour-01', name: 'Flour', description: 'All-purpose flour', purchaseCost: 5, unitMeasurement: 'kg', supplierId: 'qfm-01', stock: 100 },
  { id: 'sugar-01', name: 'Sugar', description: 'White granulated sugar', purchaseCost: 8, unitMeasurement: 'kg', supplierId: 'doha-sugar-01', stock: 50 },
  { id: 'eggs-01', name: 'Eggs', description: 'Farm fresh eggs', purchaseCost: 0.5, unitMeasurement: 'piece', supplierId: 'local-farms-01', stock: 200 },
  { id: 'milk-01', name: 'Milk', description: 'Full cream milk', purchaseCost: 6, unitMeasurement: 'l', supplierId: 'baladna-01', stock: 30 },
  { id: 'chicken-01', name: 'Chicken Breast', description: 'Boneless, skinless chicken breast', purchaseCost: 35, unitMeasurement: 'kg', supplierId: 'al-rawdah-01', stock: 20 },
  { id: 'tomatoes-01', name: 'Tomatoes', description: 'Fresh local tomatoes', purchaseCost: 4, unitMeasurement: 'kg', supplierId: 'central-market-01', stock: 40 },
  { id: 'oliveoil-01', name: 'Olive Oil', description: 'Extra virgin olive oil', purchaseCost: 25, unitMeasurement: 'l', supplierId: 'igi-01', stock: 10 },
  { id: 'rice-01', name: 'Basmati Rice', description: 'Long-grain basmati rice', purchaseCost: 12, unitMeasurement: 'kg', supplierId: 'qfi-01', stock: 80 },
  { id: 'beef-01', name: 'Beef Mince', description: 'Lean ground beef', purchaseCost: 45, unitMeasurement: 'kg', supplierId: 'al-rawdah-01', stock: 15 },
  { id: 'potatoes-01', name: 'Potatoes', description: 'Fresh potatoes', purchaseCost: 3, unitMeasurement: 'kg', supplierId: 'central-market-01', stock: 100 },
  { id: 'onions-01', name: 'Onions', description: 'Yellow onions', purchaseCost: 2.5, unitMeasurement: 'kg', supplierId: 'central-market-01', stock: 100 },
  { id: 'lentils-01', name: 'Toor Dal', description: 'Split pigeon peas', purchaseCost: 9, unitMeasurement: 'kg', supplierId: 'qfi-01', stock: 30 },
  { id: 'spinach-01', name: 'Spinach', description: 'Fresh baby spinach', purchaseCost: 15, unitMeasurement: 'kg', supplierId: 'local-farms-01', stock: 15 },
  { id: 'paneer-01', name: 'Paneer', description: 'Indian cottage cheese', purchaseCost: 28, unitMeasurement: 'kg', supplierId: 'baladna-01', stock: 20 },
  { id: 'cheese-01', name: 'Cheddar Cheese', description: 'Shredded cheddar cheese', purchaseCost: 30, unitMeasurement: 'kg', supplierId: 'baladna-01', stock: 25 },
];

const seedSuppliers = [
  { id: 'qfm-01', name: 'Qatar Flour Mills', contactInformation: 'contact@qfm.qa' },
  { id: 'doha-sugar-01', name: 'Doha Sugar Co.', contactInformation: 'sales@dohasugar.com' },
  { id: 'local-farms-01', name: 'Local Farms', contactInformation: 'info@localfarms.qa' },
  { id: 'baladna-01', name: 'Baladna', contactInformation: 'support@baladna.com.qa' },
  { id: 'al-rawdah-01', name: 'Al Rawdah', contactInformation: 'orders@alrawdah.ae' },
  { id: 'central-market-01', name: 'Central Market', contactInformation: 'market@gov.qa' },
  { id: 'igi-01', name: 'Imported Goods Inc.', contactInformation: 'import@igi.com' },
  { id: 'qfi-01', name: 'Qatar Food Imports', contactInformation: 'info@qfi.qa' },
  { id: 'al-thuraya-01', name: 'Al Thuraya', contactInformation: 'contact@al-thuraya.qa' },
];

const seedRecipes = [
  {
    id: 'biryani-01',
    name: 'Classic Chicken Biryani',
    description: 'Aromatic and flavorful biryani with tender chicken pieces.',
    imageUrl: 'https://picsum.photos/seed/biryani/600/400',
    imageHint: 'chicken biryani',
    laborCost: 15,
    overheadCost: 10,
    portionSize: 'Standard',
  },
  {
    id: 'cake-01',
    name: 'Vanilla Sponge Cake',
    description: 'A light and fluffy cake perfect for any occasion.',
    imageUrl: 'https://picsum.photos/seed/cake/600/400',
    imageHint: 'vanilla cake',
    laborCost: 20,
    overheadCost: 12,
    portionSize: '12 slices',
  },
  {
    id: 'salad-01',
    name: 'Grilled Chicken Salad',
    description: 'Healthy and delicious salad with grilled chicken breast.',
    imageUrl: 'https://picsum.photos/seed/salad/600/400',
    imageHint: 'chicken salad',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '1 person',
  },
  {
    id: 'sambar-curry-01',
    name: 'Sambar Curry',
    description: 'A classic South Indian lentil and vegetable stew.',
    imageUrl: 'https://picsum.photos/seed/sambar/600/400',
    imageHint: 'sambar curry',
    laborCost: 8,
    overheadCost: 4,
    portionSize: '1 bowl',
  },
  {
    id: 'idly-dosa-batter-01',
    name: 'Idly & Dosa Batter',
    description: 'Freshly prepared batter for soft idlis and crispy dosas.',
    imageUrl: 'https://picsum.photos/seed/batter/600/400',
    imageHint: 'dosa batter',
    laborCost: 5,
    overheadCost: 2,
    portionSize: '1kg',
  },
  {
    id: 'malabar-parotta-01',
    name: 'Malabar Parotta',
    description: 'Flaky, layered flatbread from the Malabar region.',
    imageUrl: 'https://picsum.photos/seed/parotta/600/400',
    imageHint: 'flatbread',
    laborCost: 7,
    overheadCost: 3,
    portionSize: '2 pieces',
  },
  {
    id: 'momos-01',
    name: 'Momos (Chicken, Veg, Paneer)',
    description: 'Steamed or fried dumplings with various fillings.',
    imageUrl: 'https://picsum.photos/seed/momos/600/400',
    imageHint: 'dumplings',
    laborCost: 12,
    overheadCost: 6,
    portionSize: '8 pieces',
  },
  {
    id: 'punjabi-samosa-01',
    name: 'Punjabi Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    imageUrl: 'https://picsum.photos/seed/samosa/600/400',
    imageHint: 'samosa',
    laborCost: 4,
    overheadCost: 2,
    portionSize: '2 pieces',
  },
  {
    id: 'spring-roll-01',
    name: 'Spring Roll (Veg, Chicken, Cheese)',
    description: 'Crispy rolls with a variety of savory fillings.',
    imageUrl: 'https://picsum.photos/seed/springroll/600/400',
    imageHint: 'spring rolls',
    laborCost: 9,
    overheadCost: 4,
    portionSize: '6 pieces',
  },
  {
    id: 'kibbeh-01',
    name: 'Kibbeh',
    description: 'Middle Eastern croquettes with various fillings.',
    imageUrl: 'https://picsum.photos/seed/kibbeh/600/400',
    imageHint: 'kibbeh',
    laborCost: 15,
    overheadCost: 7,
    portionSize: '4 pieces',
  },
  {
    id: 'empanada-01',
    name: 'Empanada (Meat, Chicken)',
    description: 'Baked or fried turnover pastries with savory fillings.',
    imageUrl: 'https://picsum.photos/seed/empanada/600/400',
    imageHint: 'empanada',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '2 pieces',
  },
  {
    id: 'fatayer-01',
    name: 'Fatayer',
    description: 'Middle Eastern meat pies with various fillings.',
    imageUrl: 'https://picsum.photos/seed/fatayer/600/400',
    imageHint: 'meat pie',
    laborCost: 8,
    overheadCost: 4,
    portionSize: '3 pieces',
  },
  {
    id: 'samosa-variety-01',
    name: 'Samosa (Chicken, Meat, Veg, Cheese)',
    description: 'A variety of crispy samosas with different fillings.',
    imageUrl: 'https://picsum.photos/seed/samosas/600/400',
    imageHint: 'assorted samosas',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '4 pieces',
  },
  {
    id: 'spaghetti-bolognese-01',
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with a rich meat-based sauce.',
    imageUrl: 'https://picsum.photos/seed/bolognese/600/400',
    imageHint: 'pasta bolognese',
    laborCost: 18,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'chicken-alfredo-01',
    name: 'Fettuccine Alfredo',
    description: 'Creamy pasta dish with parmesan cheese and butter.',
    imageUrl: 'https://picsum.photos/seed/alfredo/600/400',
    imageHint: 'fettuccine alfredo',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'beef-burger-01',
    name: 'Classic Beef Burger',
    description: 'A juicy beef patty on a brioche bun with lettuce, tomato, and onion.',
    imageUrl: 'https://picsum.photos/seed/burger/600/400',
    imageHint: 'beef burger',
    laborCost: 12,
    overheadCost: 6,
    portionSize: '1 burger',
  },
  {
    id: 'margarita-pizza-01',
    name: 'Margherita Pizza',
    description: 'Simple and delicious pizza with tomatoes, mozzarella, and fresh basil.',
    imageUrl: 'https://picsum.photos/seed/pizza/600/400',
    imageHint: 'margherita pizza',
    laborCost: 14,
    overheadCost: 7,
    portionSize: '12-inch pizza',
  },
  {
    id: 'hummus-01',
    name: 'Hummus with Pita',
    description: 'Creamy dip made from chickpeas, tahini, lemon, and garlic, served with warm pita bread.',
    imageUrl: 'https://picsum.photos/seed/hummus/600/400',
    imageHint: 'hummus pita',
    laborCost: 6,
    overheadCost: 3,
    portionSize: 'Appetizer',
  },
  {
    id: 'tabbouleh-01',
    name: 'Tabbouleh Salad',
    description: 'A refreshing parsley, tomato, mint, and bulgur salad.',
    imageUrl: 'https://picsum.photos/seed/tabbouleh/600/400',
    imageHint: 'tabbouleh salad',
    laborCost: 9,
    overheadCost: 4,
    portionSize: 'Side salad',
  },
  {
    id: 'chicken-katsu-curry-01',
    name: 'Chicken Katsu Curry',
    description: 'Crispy fried chicken cutlet with a savory Japanese curry sauce and rice.',
    imageUrl: 'https://picsum.photos/seed/katsu/600/400',
    imageHint: 'katsu curry',
    laborCost: 17,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'sushi-platter-01',
    name: 'Assorted Sushi Platter',
    description: 'A selection of fresh nigiri and maki rolls.',
    imageUrl: 'https://picsum.photos/seed/sushi/600/400',
    imageHint: 'sushi platter',
    laborCost: 25,
    overheadCost: 15,
    portionSize: '12 pieces',
  },
  {
    id: 'pad-thai-01',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with shrimp, tofu, peanuts, and bean sprouts.',
    imageUrl: 'https://picsum.photos/seed/padthai/600/400',
    imageHint: 'pad thai',
    laborCost: 15,
    overheadCost: 7,
    portionSize: '1 serving',
  },
  {
    id: 'green-curry-01',
    name: 'Thai Green Curry',
    description: 'Spicy and aromatic curry with chicken, coconut milk, and fresh vegetables.',
    imageUrl: 'https://picsum.photos/seed/greencurry/600/400',
    imageHint: 'thai curry',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'tacos-01',
    name: 'Beef Tacos',
    description: 'Three corn tortillas filled with seasoned ground beef, cheese, and salsa.',
    imageUrl: 'https://picsum.photos/seed/tacos/600/400',
    imageHint: 'beef tacos',
    laborCost: 13,
    overheadCost: 6,
    portionSize: '3 tacos',
  },
  {
    id: 'quesadilla-01',
    name: 'Chicken Quesadilla',
    description: 'A warm tortilla filled with chicken, cheese, and peppers, served with sour cream.',
    imageUrl: 'https://picsum.photos/seed/quesadilla/600/400',
    imageHint: 'chicken quesadilla',
    laborCost: 11,
    overheadCost: 5,
    portionSize: '1 quesadilla',
  },
  {
    id: 'fish-and-chips-01',
    name: 'Fish and Chips',
    description: 'Battered and fried cod served with thick-cut fries and tartar sauce.',
    imageUrl: 'https://picsum.photos/seed/fishchips/600/400',
    imageHint: 'fish chips',
    laborCost: 14,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'shepherds-pie-01',
    name: 'Shepherd\'s Pie',
    description: 'A savory pie of minced lamb and vegetables, topped with mashed potatoes.',
    imageUrl: 'https://picsum.photos/seed/shepherdspie/600/400',
    imageHint: 'shepherds pie',
    laborCost: 19,
    overheadCost: 10,
    portionSize: '1 serving',
  },
  {
    id: 'butter-chicken-01',
    name: 'Butter Chicken',
    description: 'Tender chicken in a mildly spiced creamy tomato sauce.',
    imageUrl: 'https://picsum.photos/seed/butterchicken/600/400',
    imageHint: 'butter chicken',
    laborCost: 18,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'palak-paneer-01',
    name: 'Palak Paneer',
    description: 'Indian cottage cheese in a smooth, creamy spinach gravy.',
    imageUrl: 'https://picsum.photos/seed/palakpaneer/600/400',
    imageHint: 'palak paneer',
    laborCost: 15,
    overheadCost: 7,
    portionSize: '1 serving',
  },
  {
    id: 'dal-makhani-01',
    name: 'Dal Makhani',
    description: 'A rich and creamy dish of black lentils and kidney beans.',
    imageUrl: 'https://picsum.photos/seed/dalmakhani/600/400',
    imageHint: 'dal makhani',
    laborCost: 12,
    overheadCost: 6,
    portionSize: '1 serving',
  },
  {
    id: 'french-onion-soup-01',
    name: 'French Onion Soup',
    description: 'A savory soup of caramelized onions, beef broth, and topped with melted cheese.',
    imageUrl: 'https://picsum.photos/seed/onionsoup/600/400',
    imageHint: 'onion soup',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '1 bowl',
  },
  {
    id: 'caesar-salad-01',
    name: 'Caesar Salad',
    description: 'Romaine lettuce and croutons dressed with parmesan cheese, lemon juice, and olive oil.',
    imageUrl: 'https://picsum.photos/seed/caesarsalad/600/400',
    imageHint: 'caesar salad',
    laborCost: 8,
    overheadCost: 4,
    portionSize: 'Side salad',
  },
  {
    id: 'pho-01',
    name: 'Vietnamese Pho',
    description: 'A fragrant noodle soup with beef or chicken, herbs, and spices.',
    imageUrl: 'https://picsum.photos/seed/pho/600/400',
    imageHint: 'pho soup',
    laborCost: 20,
    overheadCost: 10,
    portionSize: '1 large bowl',
  },
  {
    id: 'banh-mi-01',
    name: 'Banh Mi Sandwich',
    description: 'A Vietnamese sandwich with a crispy baguette, pickled vegetables, and a choice of meat.',
    imageUrl: 'https://picsum.photos/seed/banhmi/600/400',
    imageHint: 'banh mi',
    laborCost: 12,
    overheadCost: 5,
    portionSize: '1 sandwich',
  },
  {
    id: 'chocolate-lava-cake-01',
    name: 'Chocolate Lava Cake',
    description: 'A decadent chocolate cake with a molten chocolate center.',
    imageUrl: 'https://picsum.photos/seed/lavacake/600/400',
    imageHint: 'lava cake',
    laborCost: 15,
    overheadCost: 8,
    portionSize: '1 cake',
  },
  {
    id: 'cheesecake-01',
    name: 'New York Cheesecake',
    description: 'A rich and creamy cheesecake with a graham cracker crust.',
    imageUrl: 'https://picsum.photos/seed/cheesecake/600/400',
    imageHint: 'cheesecake slice',
    laborCost: 18,
    overheadCost: 10,
    portionSize: '1 slice',
  },
  {
    id: 'falafel-wrap-01',
    name: 'Falafel Wrap',
    description: 'Crispy chickpea patties in a pita wrap with tahini sauce and salad.',
    imageUrl: 'https://picsum.photos/seed/falafel/600/400',
    imageHint: 'falafel wrap',
    laborCost: 9,
    overheadCost: 4,
    portionSize: '1 wrap',
  },
  {
    id: 'shakshuka-01',
    name: 'Shakshuka',
    description: 'Eggs poached in a savory tomato and pepper sauce.',
    imageUrl: 'https://picsum.photos/seed/shakshuka/600/400',
    imageHint: 'shakshuka eggs',
    laborCost: 13,
    overheadCost: 6,
    portionSize: '1 serving',
  },
  {
    id: 'moussaka-01',
    name: 'Moussaka',
    description: 'A layered eggplant and minced meat dish, topped with a creamy béchamel sauce.',
    imageUrl: 'https://picsum.photos/seed/moussaka/600/400',
    imageHint: 'moussaka dish',
    laborCost: 22,
    overheadCost: 11,
    portionSize: '1 serving',
  },
  {
    id: 'gyros-01',
    name: 'Chicken Gyros',
    description: 'Seasoned chicken cooked on a vertical rotisserie, served in a pita with tzatziki sauce.',
    imageUrl: 'https://picsum.photos/seed/gyros/600/400',
    imageHint: 'chicken gyros',
    laborCost: 14,
    overheadCost: 7,
    portionSize: '1 wrap',
  },
  {
    id: 'ramen-01',
    name: 'Tonkotsu Ramen',
    description: 'A rich pork broth-based noodle soup with chashu pork and soft-boiled egg.',
    imageUrl: 'https://picsum.photos/seed/ramen/600/400',
    imageHint: 'ramen bowl',
    laborCost: 21,
    overheadCost: 12,
    portionSize: '1 bowl',
  },
  {
    id: 'bibimbap-01',
    name: 'Bibimbap',
    description: 'A Korean rice bowl with assorted vegetables, beef, and a fried egg.',
    imageUrl: 'https://picsum.photos/seed/bibimbap/600/400',
    imageHint: 'bibimbap bowl',
    laborCost: 17,
    overheadCost: 8,
    portionSize: '1 bowl',
  },
  {
    id: 'bulgogi-01',
    name: 'Beef Bulgogi',
    description: 'Thinly sliced, marinated beef grilled to perfection, served with rice.',
    imageUrl: 'https://picsum.photos/seed/bulgogi/600/400',
    imageHint: 'beef bulgogi',
    laborCost: 19,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'lasagna-01',
    name: 'Classic Lasagna',
    description: 'Layers of pasta, meat sauce, and cheese baked to bubbly perfection.',
    imageUrl: 'https://picsum.photos/seed/lasagna/600/400',
    imageHint: 'lasagna slice',
    laborCost: 20,
    overheadCost: 11,
    portionSize: '1 serving',
  },
  {
    id: 'carbonara-01',
    name: 'Spaghetti Carbonara',
    description: 'A simple yet elegant pasta with eggs, cheese, pancetta, and black pepper.',
    imageUrl: 'https://picsum.photos/seed/carbonara/600/400',
    imageHint: 'spaghetti carbonara',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'paella-01',
    name: 'Seafood Paella',
    description: 'A Spanish rice dish with saffron, shrimp, mussels, and clams.',
    imageUrl: 'https://picsum.photos/seed/paella/600/400',
    imageHint: 'seafood paella',
    laborCost: 28,
    overheadCost: 14,
    portionSize: '2-person serving',
  },
  {
    id: 'gazpacho-01',
    name: 'Gazpacho',
    description: 'A refreshing cold soup made of raw, blended vegetables.',
    imageUrl: 'https://picsum.photos/seed/gazpacho/600/400',
    imageHint: 'gazpacho soup',
    laborCost: 7,
    overheadCost: 3,
    portionSize: '1 bowl',
  },
  {
    id: 'dim-sum-01',
    name: 'Assorted Dim Sum',
    description: 'A variety of bite-sized portions including dumplings, buns, and rolls.',
    imageUrl: 'https://picsum.photos/seed/dimsum/600/400',
    imageHint: 'dim sum',
    laborCost: 24,
    overheadCost: 12,
    portionSize: 'Small basket',
  },
  {
    id: 'kung-pao-chicken-01',
    name: 'Kung Pao Chicken',
    description: 'A spicy, stir-fried Chinese dish made with chicken, peanuts, and vegetables.',
    imageUrl: 'https://picsum.photos/seed/kungpao/600/400',
    imageHint: 'kung pao',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'sweet-sour-pork-01',
    name: 'Sweet and Sour Pork',
    description: 'Crispy pork pieces tossed in a bright sweet and sour sauce with pineapple and peppers.',
    imageUrl: 'https://picsum.photos/seed/sweetsour/600/400',
    imageHint: 'sweet sour',
    laborCost: 18,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'lentil-soup-01',
    name: 'Lentil Soup',
    description: 'A hearty and nutritious soup made with lentils, vegetables, and spices.',
    imageUrl: 'https://picsum.photos/seed/lentilsoup/600/400',
    imageHint: 'lentil soup',
    laborCost: 8,
    overheadCost: 4,
    portionSize: '1 bowl',
  }
];

const seedRecipeIngredients = {
  'biryani-01': [
    { ingredientId: 'chicken-01', quantity: 0.5 },
    { ingredientId: 'rice-01', quantity: 0.3 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'cake-01': [
    { ingredientId: 'flour-01', quantity: 0.5 },
    { ingredientId: 'sugar-01', quantity: 0.3 },
    { ingredientId: 'eggs-01', quantity: 4 },
    { ingredientId: 'milk-01', quantity: 0.25 },
  ],
  'salad-01': [
    { ingredientId: 'chicken-01', quantity: 0.2 },
    { ingredientId: 'tomatoes-01', quantity: 0.15 },
    { ingredientId: 'oliveoil-01', quantity: 0.02 },
    { ingredientId: 'spinach-01', quantity: 0.1 },
  ],
  'spaghetti-bolognese-01': [
    { ingredientId: 'beef-01', quantity: 0.25 },
    { ingredientId: 'tomatoes-01', quantity: 0.3 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'punjabi-samosa-01': [
    { ingredientId: 'potatoes-01', quantity: 0.5 },
    { ingredientId: 'flour-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
   'palak-paneer-01': [
    { ingredientId: 'paneer-01', quantity: 0.25 },
    { ingredientId: 'spinach-01', quantity: 0.5 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
   'sambar-curry-01': [
    { ingredientId: 'lentils-01', quantity: 0.2 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
}

async function seedCollection(collectionPath: string, data: any[], batch: import('firebase/firestore').WriteBatch) {
    const collectionRef = collection(firestore, collectionPath);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Seeding '${collectionPath}'...`);
        data.forEach(item => {
            const docRef = doc(collectionRef, item.id);
            batch.set(docRef, item);
        });
    }
}

async function seedSubCollection(recipeId: string, ingredients: any[], batch: import('firebase/firestore').WriteBatch) {
    const path = `recipes/${recipeId}/recipeIngredients`;
    const collectionRef = collection(firestore, path);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Seeding '${path}'...`);
        ingredients.forEach(item => {
            const newId = uuidv4();
            const docRef = doc(collectionRef, newId);
            batch.set(docRef, { ...item, id: newId, recipeId: recipeId });
        });
    }
}

async function seedSupplierIngredients(batch: import('firebase/firestore').WriteBatch) {
    for (const supplier of seedSuppliers) {
        const ingredientsForSupplier = seedIngredients.filter(ing => ing.supplierId === supplier.id);
        if (ingredientsForSupplier.length === 0) continue;
        const ingredientsCollectionRef = collection(firestore, `suppliers/${supplier.id}/ingredients`);
        const snapshot = await getDocs(ingredientsCollectionRef);
        if (snapshot.empty) {
            console.log(`Seeding ingredients for supplier '${supplier.id}'...`);
            for (const ingredient of ingredientsForSupplier) {
                const { supplierId, ...ingredientData } = ingredient;
                const docRef = doc(ingredientsCollectionRef, ingredient.id);
                batch.set(docRef, ingredientData);
            }
        }
    }
}


export async function seedDatabase() {
    try {
        const batch = writeBatch(firestore);

        await seedCollection('suppliers', seedSuppliers, batch);
        await seedSupplierIngredients(batch);
        await seedCollection('recipes', seedRecipes, batch);
        
        for (const recipe of seedRecipes) {
            const ingredients = seedRecipeIngredients[recipe.id as keyof typeof seedRecipeIngredients];
            if (ingredients) {
                await seedSubCollection(recipe.id, ingredients, batch);
            }
        }
        
        await batch.commit();
        console.log("Database seeding check complete.");

    } catch (error) {
        if ((error as any).code !== 'failed-precondition') { // It's okay if it's already seeded
            console.error("Error seeding database: ", error);
        }
    }
}
