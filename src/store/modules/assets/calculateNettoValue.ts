/* 
Obliczamy całkowity koszt nabycia zasobu - ilość zasobu * cena za 1 sztuke opłaty transakcyjne

Do funkcji podajemy calkowity koszt nabycia zasobu (acquisitionCost)
oraz obecną wartość danej ilości zasobu.
Obecna wartość danej ilości zasobu to ilość zasobu * cena za 1 sztukę - za tyle teraz chcemy sprzedać (currentCost)

acquisitionCost = 100
currentCost = 120

zysk = currentCost - acquisitionCost = 20
taskValue = 0.19
podatekOdZysku = zysk * taxValue = 20 * 0.19 = 3.8
netto = currentCost - podatekOdZysku
*/

export default function calculateNettoValue(
    currentCost: number,
    acquisitionCost: number,
    taxValue: number
) {
    const profit = currentCost - acquisitionCost
    if (profit > 0) {
        const profitTax = profit * taxValue
        const netto = currentCost - profitTax
        return netto
    } else return currentCost
}
