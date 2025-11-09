'use client';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Supplier } from '@/lib/types';
import * as XLSX from 'xlsx';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Upload } from 'lucide-react';
import {v4 as uuidv4} from 'uuid';

interface IngredientImportProps {
    suppliers: Supplier[];
}

// Expected columns in the Excel file. Case-insensitive and ignores spaces.
const expectedColumns = {
    'name': 'name',
    'description': 'description',
    'purchasecost': 'purchaseCost',
    'unitmeasurement': 'unitMeasurement',
    'suppliername': 'supplierName',
    'stock': 'stock',
};

type ExcelRow = {
    [key: string]: any;
};

export function IngredientImport({ suppliers }: IngredientImportProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const firestore = useFirestore();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

                if(json.length === 0){
                    toast({ variant: 'destructive', title: 'Import Error', description: 'The selected file is empty.' });
                    return;
                }

                await processAndUpload(json);

            } catch (error) {
                console.error("Error processing file: ", error);
                toast({ variant: 'destructive', title: 'Import Error', description: 'Failed to read or process the Excel file.' });
            } finally {
                // Reset file input to allow re-uploading the same file
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };
    
    const processAndUpload = async (rows: ExcelRow[]) => {
        toast({ title: 'Importing...', description: `Processing ${rows.length} records.` });

        const batch = writeBatch(firestore);
        let validRecordsCount = 0;
        let errorMessages: string[] = [];

        // Create a map for quick supplier lookup
        const supplierMap = new Map(suppliers.map(s => [s.name.toLowerCase(), s.id]));

        rows.forEach((row, index) => {
            const normalizedRow: {[key: string]: any} = {};
            const rowNumber = index + 2; // Excel rows are 1-based, plus header

            // Normalize keys to lowercase to match expectedColumns
            Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase().replace(/\s+/g, '')] = row[key];
            });

            // Basic validation
            if (!normalizedRow.name) {
                errorMessages.push(`Row ${rowNumber}: 'Name' is missing.`);
                return;
            }
            if (normalizedRow.purchasecost === undefined) {
                 errorMessages.push(`Row ${rowNumber}: 'PurchaseCost' is missing.`);
                return;
            }
             if (!normalizedRow.unitmeasurement) {
                 errorMessages.push(`Row ${rowNumber}: 'UnitMeasurement' is missing.`);
                return;
            }
            if (!normalizedRow.suppliername) {
                 errorMessages.push(`Row ${rowNumber}: 'SupplierName' is missing.`);
                return;
            }

            const supplierId = supplierMap.get(normalizedRow.suppliername.toLowerCase());
            if (!supplierId) {
                errorMessages.push(`Row ${rowNumber}: Supplier '${normalizedRow.suppliername}' not found.`);
                return;
            }

            const ingredientId = uuidv4();
            const ingredientsCollectionRef = collection(firestore, `suppliers/${supplierId}/ingredients`);
            const docRef = doc(ingredientsCollectionRef, ingredientId);

            batch.set(docRef, {
                id: ingredientId,
                name: normalizedRow.name,
                description: normalizedRow.description || '',
                purchaseCost: parseFloat(normalizedRow.purchasecost),
                unitMeasurement: normalizedRow.unitmeasurement,
                supplierId: supplierId,
                stock: parseInt(normalizedRow.stock || '0', 10),
            });
            validRecordsCount++;
        });

        if (errorMessages.length > 0) {
            toast({
                variant: "destructive",
                title: `Import failed for ${errorMessages.length} records`,
                description: (
                    <div className="max-h-40 overflow-y-auto">
                        {errorMessages.slice(0, 5).map((msg, i) => <p key={i}>{msg}</p>)}
                        {errorMessages.length > 5 && <p>...and {errorMessages.length - 5} more errors.</p>}
                    </div>
                ),
            });
             if (validRecordsCount === 0) return; // Don't proceed if no records are valid
        }

        if (validRecordsCount > 0) {
            try {
                await batch.commit();
                toast({
                    title: "Import Complete",
                    description: `${validRecordsCount} ingredients were successfully imported. ${errorMessages.length > 0 ? `${errorMessages.length} records failed.` : '' }`,
                });
            } catch (error) {
                console.error("Firestore batch commit failed: ", error);
                toast({
                    variant: "destructive",
                    title: "Upload Error",
                    description: "Failed to save ingredients to the database.",
                });
            }
        }
    }


    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .csv"
            />
            <Button variant="outline" onClick={handleButtonClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import
            </Button>
        </div>
    );
}
