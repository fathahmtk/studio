import { collection, doc, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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
];

const seedRecipeIngredients = {
  'biryani-01': [
    { ingredientId: 'chicken-01', quantity: 0.5 },
    { ingredientId: 'rice-01', quantity: 0.3 },
    { ingredientId: 'tomatoes-01', quantity: 0.2 },
    { ingredientId: 'oliveoil-01', quantity: 0.05 },
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
  ],
}


async function seedCollection(collectionPath: string, data: any[]) {
    const { setDocumentNonBlocking } = await import('@/firebase/non-blocking-updates');
    const collectionRef = collection(firestore, collectionPath);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Seeding '${collectionPath}'...`);
        const promises = data.map(item => {
            const docRef = doc(collectionRef, item.id);
            return setDocumentNonBlocking(docRef, item, {});
        });
        await Promise.all(promises);
    }
}

async function seedSubCollection(recipeId: string, ingredients: any[]) {
    const { setDocumentNonBlocking } = await import('@/firebase/non-blocking-updates');
    const path = `/recipes/${recipeId}/recipeIngredients`;
    const collectionRef = collection(firestore, path);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Seeding '${path}'...`);
        const promises = ingredients.map(item => {
            // Using ingredientId as the document ID for simplicity and uniqueness
            const docRef = doc(collectionRef, item.ingredientId);
            return setDocumentNonBlocking(docRef, item, {});
        });
        await Promise.all(promises);
    }
}


export async function seedDatabase() {
    try {
        await seedCollection('suppliers', seedSuppliers);

        // Seed ingredients under their respective suppliers
        const { setDocumentNonBlocking } = await import('@/firebase/non-blocking-updates');
        for (const supplier of seedSuppliers) {
            const ingredientsForSupplier = seedIngredients.filter(ing => ing.supplierId === supplier.id);
            const ingredientsCollectionRef = collection(firestore, `/suppliers/${supplier.id}/ingredients`);
            const snapshot = await getDocs(ingredientsCollectionRef);
            if (snapshot.empty) {
                console.log(`Seeding ingredients for supplier '${supplier.id}'...`);
                for (const ingredient of ingredientsForSupplier) {
                    const { supplierId, ...ingredientData } = ingredient;
                    const docRef = doc(ingredientsCollectionRef, ingredient.id);
                    setDocumentNonBlocking(docRef, ingredientData, {});
                }
            }
        }

        await seedCollection('recipes', seedRecipes);

        for (const recipe of seedRecipes) {
            const ingredients = seedRecipeIngredients[recipe.id as keyof typeof seedRecipeIngredients];
            if (ingredients) {
                await seedSubCollection(recipe.id, ingredients);
            }
        }

        console.log("Database seeding check complete.");
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}
