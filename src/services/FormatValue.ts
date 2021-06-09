export const formatValue = (value: number, precision: number) =>
    value.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    })

export const displayOnlySignificatDigits = (value: number, precision: number) =>
    Number.isInteger(value) ? value.toFixed(2) : (parseFloat(value.toPrecision(precision)) * 1).toString()
