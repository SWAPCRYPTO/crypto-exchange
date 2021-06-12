const MINIMUM_FRACTION_DIGITS = 2
const MIN_PRECISION = 6

// Find number of zeros after comma before a significant digit
const findMagnitute = (value: number) => Math.floor(Math.log10(value) + 1)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const formatValue = (value: number, precision = 2) => {
    const numberMagnitute = findMagnitute(value)
    if (value > -1 && value != 0 && value < 1) {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: MIN_PRECISION,
            maximumFractionDigits:
                numberMagnitute < MIN_PRECISION && numberMagnitute > 0 ? numberMagnitute : MIN_PRECISION + 2,
        })
    }

    return value.toLocaleString(undefined, {
        minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
        maximumFractionDigits: MINIMUM_FRACTION_DIGITS,
    })
}

export const displayOnlySignificatDigits = (value: number, precision: number) =>
    Number.isInteger(value) ? value.toFixed(2) : (parseFloat(value.toPrecision(precision)) * 1).toString()
