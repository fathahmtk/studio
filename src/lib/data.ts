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
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'chicken biryani',
    laborCost: 15,
    overheadCost: 10,
    portionSize: 'Standard',
  },
  {
    id: 'cake-01',
    name: 'Vanilla Sponge Cake',
    description: 'A light and fluffy cake perfect for any occasion.',
    imageUrl: 'https://images.unsplash.com/photo-1562440102-385a85539339?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'vanilla cake',
    laborCost: 20,
    overheadCost: 12,
    portionSize: '12 slices',
  },
  {
    id: 'salad-01',
    name: 'Grilled Chicken Salad',
    description: 'Healthy and delicious salad with grilled chicken breast.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'chicken salad',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '1 person',
  },
  {
    id: 'sambar-curry-01',
    name: 'Sambar Curry',
    description: 'A classic South Indian lentil and vegetable stew.',
    imageUrl: 'https://images.unsplash.com/photo-1626508035292-0264e13e144a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'sambar curry',
    laborCost: 8,
    overheadCost: 4,
    portionSize: '1 bowl',
  },
  {
    id: 'idly-dosa-batter-01',
    name: 'Idly & Dosa Batter',
    description: 'Freshly prepared batter for soft idlis and crispy dosas.',
    imageUrl: 'https://images.unsplash.com/photo-1668665793094-0710696270c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'dosa batter',
    laborCost: 5,
    overheadCost: 2,
    portionSize: '1kg',
  },
  {
    id: 'malabar-parotta-01',
    name: 'Malabar Parotta',
    description: 'Flaky, layered flatbread from the Malabar region.',
    imageUrl: 'https://images.unsplash.com/photo-1626517967910-38317a3348a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'flatbread',
    laborCost: 7,
    overheadCost: 3,
    portionSize: '2 pieces',
  },
  {
    id: 'momos-01',
    name: 'Momos (Chicken, Veg, Paneer)',
    description: 'Steamed or fried dumplings with various fillings.',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'dumplings',
    laborCost: 12,
    overheadCost: 6,
    portionSize: '8 pieces',
  },
  {
    id: 'punjabi-samosa-01',
    name: 'Punjabi Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    imageUrl: 'https://images.unsplash.com/photo-1601254352722-683416b7a563?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'samosa',
    laborCost: 4,
    overheadCost: 2,
    portionSize: '2 pieces',
  },
  {
    id: 'spring-roll-01',
    name: 'Spring Roll (Veg, Chicken, Cheese)',
    description: 'Crispy rolls with a variety of savory fillings.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f397918e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'spring rolls',
    laborCost: 9,
    overheadCost: 4,
    portionSize: '6 pieces',
  },
  {
    id: 'kibbeh-01',
    name: 'Kibbeh',
    description: 'Middle Eastern croquettes with various fillings.',
    imageUrl: 'https://images.unsplash.com/photo-1544890225-2f3faec4446f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'kibbeh',
    laborCost: 15,
    overheadCost: 7,
    portionSize: '4 pieces',
  },
  {
    id: 'empanada-01',
    name: 'Empanada (Meat, Chicken)',
    description: 'Baked or fried turnover pastries with savory fillings.',
    imageUrl: 'https://images.unsplash.com/photo-1623887241359-aa3f1d244ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'empanada',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '2 pieces',
  },
  {
    id: 'fatayer-01',
    name: 'Fatayer',
    description: 'Middle Eastern meat pies with various fillings.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1673822119292-3c873a4a985a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'meat pie',
    laborCost: 8,
    overheadCost: 4,
    portionSize: '3 pieces',
  },
  {
    id: 'samosa-variety-01',
    name: 'Samosa (Chicken, Meat, Veg, Cheese)',
    description: 'A variety of crispy samosas with different fillings.',
    imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f439d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'assorted samosas',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '4 pieces',
  },
  {
    id: 'spaghetti-bolognese-01',
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with a rich meat-based sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1589227365533-5f8e0a816911?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'pasta bolognese',
    laborCost: 18,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'chicken-alfredo-01',
    name: 'Fettuccine Alfredo',
    description: 'Creamy pasta dish with parmesan cheese and butter.',
    imageUrl: 'https://images.unsplash.com/photo-1612874421979-5e8d8c6b7a6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'fettuccine alfredo',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'beef-burger-01',
    name: 'Classic Beef Burger',
    description: 'A juicy beef patty on a brioche bun with lettuce, tomato, and onion.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=699&q=80',
    imageHint: 'beef burger',
    laborCost: 12,
    overheadCost: 6,
    portionSize: '1 burger',
  },
  {
    id: 'margarita-pizza-01',
    name: 'Margherita Pizza',
    description: 'Simple and delicious pizza with tomatoes, mozzarella, and fresh basil.',
    imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=728&q=80',
    imageHint: 'margherita pizza',
    laborCost: 14,
    overheadCost: 7,
    portionSize: '12-inch pizza',
  },
  {
    id: 'hummus-01',
    name: 'Hummus with Pita',
    description: 'Creamy dip made from chickpeas, tahini, lemon, and garlic, served with warm pita bread.',
    imageUrl: 'https://images.unsplash.com/photo-1630409349883-431878d653a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'hummus pita',
    laborCost: 6,
    overheadCost: 3,
    portionSize: 'Appetizer',
  },
  {
    id: 'tabbouleh-01',
    name: 'Tabbouleh Salad',
    description: 'A refreshing parsley, tomato, mint, and bulgur salad.',
    imageUrl: 'https://images.unsplash.com/photo-1594313533423-f273e9a59333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'tabbouleh salad',
    laborCost: 9,
    overheadCost: 4,
    portionSize: 'Side salad',
  },
  {
    id: 'chicken-katsu-curry-01',
    name: 'Chicken Katsu Curry',
    description: 'Crispy fried chicken cutlet with a savory Japanese curry sauce and rice.',
    imageUrl: 'https://images.unsplash.com/photo-1598514983935-3644f775691d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'katsu curry',
    laborCost: 17,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'sushi-platter-01',
    name: 'Assorted Sushi Platter',
    description: 'A selection of fresh nigiri and maki rolls.',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'sushi platter',
    laborCost: 25,
    overheadCost: 15,
    portionSize: '12 pieces',
  },
  {
    id: 'pad-thai-01',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with shrimp, tofu, peanuts, and bean sprouts.',
    imageUrl: 'https://images.unsplash.com/photo-1567608285974-91d1a667d35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'pad thai',
    laborCost: 15,
    overheadCost: 7,
    portionSize: '1 serving',
  },
  {
    id: 'green-curry-01',
    name: 'Thai Green Curry',
    description: 'Spicy and aromatic curry with chicken, coconut milk, and fresh vegetables.',
    imageUrl: 'https://images.unsplash.com/photo-1628585352636-f3893051052b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'thai curry',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'tacos-01',
    name: 'Beef Tacos',
    description: 'Three corn tortillas filled with seasoned ground beef, cheese, and salsa.',
    imageUrl: 'https://images.unsplash.com/photo-1565299589934-3c0f139a585f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    imageHint: 'beef tacos',
    laborCost: 13,
    overheadCost: 6,
    portionSize: '3 tacos',
  },
  {
    id: 'quesadilla-01',
    name: 'Chicken Quesadilla',
    description: 'A warm tortilla filled with chicken, cheese, and peppers, served with sour cream.',
    imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80',
    imageHint: 'chicken quesadilla',
    laborCost: 11,
    overheadCost: 5,
    portionSize: '1 quesadilla',
  },
  {
    id: 'fish-and-chips-01',
    name: 'Fish and Chips',
    description: 'Battered and fried cod served with thick-cut fries and tartar sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1579887829871-c7c109c48873?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'fish chips',
    laborCost: 14,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'shepherds-pie-01',
    name: 'Shepherd\'s Pie',
    description: 'A savory pie of minced lamb and vegetables, topped with mashed potatoes.',
    imageUrl: 'https://images.unsplash.com/photo-1608877543887-a068f6153929?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'shepherds pie',
    laborCost: 19,
    overheadCost: 10,
    portionSize: '1 serving',
  },
  {
    id: 'butter-chicken-01',
    name: 'Butter Chicken',
    description: 'Tender chicken in a mildly spiced creamy tomato sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'butter chicken',
    laborCost: 18,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'palak-paneer-01',
    name: 'Palak Paneer',
    description: 'Indian cottage cheese in a smooth, creamy spinach gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1574672281099-e6311e9f1a7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'palak paneer',
    laborCost: 15,
    overheadCost: 7,
    portionSize: '1 serving',
  },
  {
    id: 'dal-makhani-01',
    name: 'Dal Makhani',
    description: 'A rich and creamy dish of black lentils and kidney beans.',
    imageUrl: 'https://images.unsplash.com/photo-1601205163148-52b5d4a13247?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'dal makhani',
    laborCost: 12,
    overheadCost: 6,
    portionSize: '1 serving',
  },
  {
    id: 'french-onion-soup-01',
    name: 'French Onion Soup',
    description: 'A savory soup of caramelized onions, beef broth, and topped with melted cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1549401719-74e6aaa4de03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'onion soup',
    laborCost: 10,
    overheadCost: 5,
    portionSize: '1 bowl',
  },
  {
    id: 'caesar-salad-01',
    name: 'Caesar Salad',
    description: 'Romaine lettuce and croutons dressed with parmesan cheese, lemon juice, and olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'caesar salad',
    laborCost: 8,
    overheadCost: 4,
    portionSize: 'Side salad',
  },
  {
    id: 'pho-01',
    name: 'Vietnamese Pho',
    description: 'A fragrant noodle soup with beef or chicken, herbs, and spices.',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'pho soup',
    laborCost: 20,
    overheadCost: 10,
    portionSize: '1 large bowl',
  },
  {
    id: 'banh-mi-01',
    name: 'Banh Mi Sandwich',
    description: 'A Vietnamese sandwich with a crispy baguette, pickled vegetables, and a choice of meat.',
    imageUrl: 'https://images.unsplash.com/photo-1567234661513-502a0a57e6a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'banh mi',
    laborCost: 12,
    overheadCost: 5,
    portionSize: '1 sandwich',
  },
  {
    id: 'chocolate-lava-cake-01',
    name: 'Chocolate Lava Cake',
    description: 'A decadent chocolate cake with a molten chocolate center.',
    imageUrl: 'https://images.unsplash.com/photo-1579112933643-34df898c6356?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'lava cake',
    laborCost: 15,
    overheadCost: 8,
    portionSize: '1 cake',
  },
  {
    id: 'cheesecake-01',
    name: 'New York Cheesecake',
    description: 'A rich and creamy cheesecake with a graham cracker crust.',
    imageUrl: 'https://images.unsplash.com/photo-1549410214-874e0e561491?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'cheesecake slice',
    laborCost: 18,
    overheadCost: 10,
    portionSize: '1 slice',
  },
  {
    id: 'falafel-wrap-01',
    name: 'Falafel Wrap',
    description: 'Crispy chickpea patties in a pita wrap with tahini sauce and salad.',
    imageUrl: 'https://images.unsplash.com/photo-1569728987132-88c9a896f424?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'falafel wrap',
    laborCost: 9,
    overheadCost: 4,
    portionSize: '1 wrap',
  },
  {
    id: 'shakshuka-01',
    name: 'Shakshuka',
    description: 'Eggs poached in a savory tomato and pepper sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'shakshuka eggs',
    laborCost: 13,
    overheadCost: 6,
    portionSize: '1 serving',
  },
  {
    id: 'moussaka-01',
    name: 'Moussaka',
    description: 'A layered eggplant and minced meat dish, topped with a creamy béchamel sauce.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1678850130283-a44138b30030?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'moussaka dish',
    laborCost: 22,
    overheadCost: 11,
    portionSize: '1 serving',
  },
  {
    id: 'gyros-01',
    name: 'Chicken Gyros',
    description: 'Seasoned chicken cooked on a vertical rotisserie, served in a pita with tzatziki sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1628045388012-707a0e36506a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'chicken gyros',
    laborCost: 14,
    overheadCost: 7,
    portionSize: '1 wrap',
  },
  {
    id: 'ramen-01',
    name: 'Tonkotsu Ramen',
    description: 'A rich pork broth-based noodle soup with chashu pork and soft-boiled egg.',
    imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'ramen bowl',
    laborCost: 21,
    overheadCost: 12,
    portionSize: '1 bowl',
  },
  {
    id: 'bibimbap-01',
    name: 'Bibimbap',
    description: 'A Korean rice bowl with assorted vegetables, beef, and a fried egg.',
    imageUrl: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'bibimbap bowl',
    laborCost: 17,
    overheadCost: 8,
    portionSize: '1 bowl',
  },
  {
    id: 'bulgogi-01',
    name: 'Beef Bulgogi',
    description: 'Thinly sliced, marinated beef grilled to perfection, served with rice.',
    imageUrl: 'https://images.unsplash.com/photo-1628345945892-22d7d8f376a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'beef bulgogi',
    laborCost: 19,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'lasagna-01',
    name: 'Classic Lasagna',
    description: 'Layers of pasta, meat sauce, and cheese baked to bubbly perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1574894709922-1ae3b3a4e2c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'lasagna slice',
    laborCost: 20,
    overheadCost: 11,
    portionSize: '1 serving',
  },
  {
    id: 'carbonara-01',
    name: 'Spaghetti Carbonara',
    description: 'A simple yet elegant pasta with eggs, cheese, pancetta, and black pepper.',
    imageUrl: 'https://images.unsplash.com/photo-1588013273468-21508b43a27c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'spaghetti carbonara',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'paella-01',
    name: 'Seafood Paella',
    description: 'A Spanish rice dish with saffron, shrimp, mussels, and clams.',
    imageUrl: 'https://images.unsplash.com/photo-1510591238384-ad4b6a9e14a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'seafood paella',
    laborCost: 28,
    overheadCost: 14,
    portionSize: '2-person serving',
  },
  {
    id: 'gazpacho-01',
    name: 'Gazpacho',
    description: 'A refreshing cold soup made of raw, blended vegetables.',
    imageUrl: 'https://images.unsplash.com/photo-1587575772935-4309117f336a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'gazpacho soup',
    laborCost: 7,
    overheadCost: 3,
    portionSize: '1 bowl',
  },
  {
    id: 'dim-sum-01',
    name: 'Assorted Dim Sum',
    description: 'A variety of bite-sized portions including dumplings, buns, and rolls.',
    imageUrl: 'https://images.unsplash.com/photo-1526414299379-3507c8130541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'dim sum',
    laborCost: 24,
    overheadCost: 12,
    portionSize: 'Small basket',
  },
  {
    id: 'kung-pao-chicken-01',
    name: 'Kung Pao Chicken',
    description: 'A spicy, stir-fried Chinese dish made with chicken, peanuts, and vegetables.',
    imageUrl: 'https://images.unsplash.com/photo-1600185816462-09893d98a2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'kung pao',
    laborCost: 16,
    overheadCost: 8,
    portionSize: '1 serving',
  },
  {
    id: 'sweet-sour-pork-01',
    name: 'Sweet and Sour Pork',
    description: 'Crispy pork pieces tossed in a bright sweet and sour sauce with pineapple and peppers.',
    imageUrl: 'https://images.unsplash.com/photo-1559868848-0a133f9905b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    imageHint: 'sweet sour',
    laborCost: 18,
    overheadCost: 9,
    portionSize: '1 serving',
  },
  {
    id: 'lentil-soup-01',
    name: 'Lentil Soup',
    description: 'A hearty and nutritious soup made with lentils, vegetables, and spices.',
    imageUrl: 'https://images.unsplash.com/photo-1620888210373-207d573d8234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
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
  'sambar-curry-01': [
    { ingredientId: 'lentils-01', quantity: 0.2 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'potatoes-01', quantity: 0.15 },
  ],
  'idly-dosa-batter-01': [
    { ingredientId: 'rice-01', quantity: 0.7 },
    { ingredientId: 'lentils-01', quantity: 0.3 },
  ],
  'malabar-parotta-01': [
    { ingredientId: 'flour-01', quantity: 0.4 },
    { ingredientId: 'milk-01', quantity: 0.1 },
    { ingredientId: 'eggs-01', quantity: 1 },
    { ingredientId: 'sugar-01', quantity: 0.02 },
  ],
  'momos-01': [
    { ingredientId: 'flour-01', quantity: 0.3 },
    { ingredientId: 'chicken-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'punjabi-samosa-01': [
    { ingredientId: 'potatoes-01', quantity: 0.5 },
    { ingredientId: 'flour-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
  ],
  'spring-roll-01': [
    { ingredientId: 'flour-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'potatoes-01', quantity: 0.15 },
    { ingredientId: 'chicken-01', quantity: 0.1 },
  ],
  'kibbeh-01': [
    { ingredientId: 'beef-01', quantity: 0.4 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
  ],
  'empanada-01': [
    { ingredientId: 'flour-01', quantity: 0.3 },
    { ingredientId: 'beef-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'eggs-01', quantity: 1 },
  ],
  'fatayer-01': [
    { ingredientId: 'flour-01', quantity: 0.3 },
    { ingredientId: 'spinach-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'cheese-01', quantity: 0.05 },
  ],
  'samosa-variety-01': [
    { ingredientId: 'flour-01', quantity: 0.3 },
    { ingredientId: 'potatoes-01', quantity: 0.2 },
    { ingredientId: 'chicken-01', quantity: 0.1 },
    { ingredientId: 'cheese-01', quantity: 0.05 },
  ],
  'spaghetti-bolognese-01': [
    { ingredientId: 'beef-01', quantity: 0.25 },
    { ingredientId: 'tomatoes-01', quantity: 0.3 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'oliveoil-01', quantity: 0.03 },
  ],
  'chicken-alfredo-01': [
    { ingredientId: 'chicken-01', quantity: 0.3 },
    { ingredientId: 'milk-01', quantity: 0.2 },
    { ingredientId: 'cheese-01', quantity: 0.1 },
    { ingredientId: 'flour-01', quantity: 0.05 },
  ],
  'beef-burger-01': [
    { ingredientId: 'beef-01', quantity: 0.2 },
    { ingredientId: 'cheese-01', quantity: 0.05 },
    { ingredientId: 'onions-01', quantity: 0.05 },
    { ingredientId: 'tomatoes-01', quantity: 0.05 },
  ],
  'margarita-pizza-01': [
    { ingredientId: 'flour-01', quantity: 0.25 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
    { ingredientId: 'cheese-01', quantity: 0.15 },
    { ingredientId: 'oliveoil-01', quantity: 0.02 },
  ],
  'hummus-01': [
    { ingredientId: 'lentils-01', quantity: 0.3 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
  ],
  'tabbouleh-01': [
    { ingredientId: 'tomatoes-01', quantity: 0.3 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
  ],
  'chicken-katsu-curry-01': [
    { ingredientId: 'chicken-01', quantity: 0.3 },
    { ingredientId: 'rice-01', quantity: 0.2 },
    { ingredientId: 'potatoes-01', quantity: 0.1 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'pad-thai-01': [
    { ingredientId: 'rice-01', quantity: 0.2 },
    { ingredientId: 'chicken-01', quantity: 0.15 },
    { ingredientId: 'eggs-01', quantity: 2 },
    { ingredientId: 'onions-01', quantity: 0.05 },
  ],
  'green-curry-01': [
    { ingredientId: 'chicken-01', quantity: 0.3 },
    { ingredientId: 'milk-01', quantity: 0.2 },
    { ingredientId: 'rice-01', quantity: 0.15 },
    { ingredientId: 'spinach-01', quantity: 0.05 },
  ],
  'tacos-01': [
    { ingredientId: 'beef-01', quantity: 0.2 },
    { ingredientId: 'flour-01', quantity: 0.1 },
    { ingredientId: 'cheese-01', quantity: 0.1 },
    { ingredientId: 'tomatoes-01', quantity: 0.1 },
  ],
  'quesadilla-01': [
    { ingredientId: 'flour-01', quantity: 0.15 },
    { ingredientId: 'chicken-01', quantity: 0.2 },
    { ingredientId: 'cheese-01', quantity: 0.1 },
    { ingredientId: 'onions-01', quantity: 0.05 },
  ],
  'fish-and-chips-01': [
    { ingredientId: 'potatoes-01', quantity: 0.5 },
    { ingredientId: 'flour-01', quantity: 0.2 },
    { ingredientId: 'eggs-01', quantity: 1 },
  ],
  'shepherds-pie-01': [
    { ingredientId: 'beef-01', quantity: 0.3 },
    { ingredientId: 'potatoes-01', quantity: 0.5 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'milk-01', quantity: 0.1 },
  ],
  'butter-chicken-01': [
    { ingredientId: 'chicken-01', quantity: 0.4 },
    { ingredientId: 'tomatoes-01', quantity: 0.3 },
    { ingredientId: 'milk-01', quantity: 0.15 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'palak-paneer-01': [
    { ingredientId: 'paneer-01', quantity: 0.25 },
    { ingredientId: 'spinach-01', quantity: 0.5 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'milk-01', quantity: 0.1 },
  ],
  'dal-makhani-01': [
    { ingredientId: 'lentils-01', quantity: 0.3 },
    { ingredientId: 'milk-01', quantity: 0.1 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
  ],
  'french-onion-soup-01': [
    { ingredientId: 'onions-01', quantity: 0.5 },
    { ingredientId: 'cheese-01', quantity: 0.1 },
    { ingredientId: 'flour-01', quantity: 0.05 },
  ],
  'caesar-salad-01': [
    { ingredientId: 'spinach-01', quantity: 0.2 },
    { ingredientId: 'cheese-01', quantity: 0.05 },
    { ingredientId: 'chicken-01', quantity: 0.15 },
    { ingredientId: 'oliveoil-01', quantity: 0.02 },
  ],
  'pho-01': [
    { ingredientId: 'rice-01', quantity: 0.2 },
    { ingredientId: 'beef-01', quantity: 0.2 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'banh-mi-01': [
    { ingredientId: 'flour-01', quantity: 0.15 },
    { ingredientId: 'beef-01', quantity: 0.15 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'chocolate-lava-cake-01': [
    { ingredientId: 'flour-01', quantity: 0.1 },
    { ingredientId: 'sugar-01', quantity: 0.15 },
    { ingredientId: 'eggs-01', quantity: 3 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
  ],
  'cheesecake-01': [
    { ingredientId: 'cheese-01', quantity: 0.4 },
    { ingredientId: 'sugar-01', quantity: 0.2 },
    { ingredientId: 'eggs-01', quantity: 4 },
    { ingredientId: 'flour-01', quantity: 0.1 },
  ],
  'falafel-wrap-01': [
    { ingredientId: 'lentils-01', quantity: 0.2 },
    { ingredientId: 'flour-01', quantity: 0.1 },
    { ingredientId: 'tomatoes-01', quantity: 0.1 },
  ],
  'shakshuka-01': [
    { ingredientId: 'tomatoes-01', quantity: 0.4 },
    { ingredientId: 'eggs-01', quantity: 3 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
  ],
  'moussaka-01': [
    { ingredientId: 'potatoes-01', quantity: 0.3 },
    { ingredientId: 'beef-01', quantity: 0.3 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
    { ingredientId: 'milk-01', quantity: 0.1 },
  ],
  'gyros-01': [
    { ingredientId: 'flour-01', quantity: 0.15 },
    { ingredientId: 'chicken-01', quantity: 0.25 },
    { ingredientId: 'tomatoes-01', quantity: 0.1 },
    { ingredientId: 'onions-01', quantity: 0.05 },
  ],
  'ramen-01': [
    { ingredientId: 'rice-01', quantity: 0.2 },
    { ingredientId: 'beef-01', quantity: 0.15 },
    { ingredientId: 'eggs-01', quantity: 1 },
    { ingredientId: 'spinach-01', quantity: 0.05 },
  ],
  'bibimbap-01': [
    { ingredientId: 'rice-01', quantity: 0.25 },
    { ingredientId: 'beef-01', quantity: 0.15 },
    { ingredientId: 'eggs-01', quantity: 1 },
    { ingredientId: 'spinach-01', quantity: 0.1 },
  ],
  'bulgogi-01': [
    { ingredientId: 'beef-01', quantity: 0.3 },
    { ingredientId: 'rice-01', quantity: 0.2 },
    { ingredientId: 'sugar-01', quantity: 0.05 },
    { ingredientId: 'onions-01', quantity: 0.1 },
  ],
  'lasagna-01': [
    { ingredientId: 'flour-01', quantity: 0.2 },
    { ingredientId: 'beef-01', quantity: 0.3 },
    { ingredientId: 'cheese-01', quantity: 0.2 },
    { ingredientId: 'tomatoes-01', quantity: 0.3 },
  ],
  'carbonara-01': [
    { ingredientId: 'flour-01', quantity: 0.2 },
    { ingredientId: 'eggs-01', quantity: 3 },
    { ingredientId: 'cheese-01', quantity: 0.1 },
    { ingredientId: 'beef-01', quantity: 0.1 },
  ],
  'paella-01': [
    { ingredientId: 'rice-01', quantity: 0.4 },
    { ingredientId: 'chicken-01', quantity: 0.2 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
  ],
  'gazpacho-01': [
    { ingredientId: 'tomatoes-01', quantity: 0.6 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
  ],
  'dim-sum-01': [
    { ingredientId: 'flour-01', quantity: 0.3 },
    { ingredientId: 'chicken-01', quantity: 0.2 },
    { ingredientId: 'spinach-01', quantity: 0.1 },
  ],
  'kung-pao-chicken-01': [
    { ingredientId: 'chicken-01', quantity: 0.4 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'sugar-01', quantity: 0.05 },
  ],
  'sweet-sour-pork-01': [
    { ingredientId: 'beef-01', quantity: 0.3 },
    { ingredientId: 'sugar-01', quantity: 0.1 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'tomatoes-01', quantity: 0.1 },
  ],
  'lentil-soup-01': [
    { ingredientId: 'lentils-01', quantity: 0.4 },
    { ingredientId: 'onions-01', quantity: 0.1 },
    { ingredientId: 'potatoes-01', quantity: 0.2 },
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
