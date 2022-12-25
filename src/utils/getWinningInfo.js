import batchesOf from './batchesOf'

export default function getWinningInfo(cells) {
    const turnIntoValueAndIndex = (cellValue, originalIndex) => ({
        cellValue,
        originalIndex,
    })
    const returnOriginalIndexes = ({ originalIndex }) => originalIndex

    for (let k of [1, 2]) {
        const cellValuesEqualK = ({ cellValue }) => cellValue === k

        const horizontalRows = batchesOf(cells.map(turnIntoValueAndIndex), 3)
        for (const row of horizontalRows) {
            if (row.every(cellValuesEqualK))
                return {
                    winner: k,
                    winningCells: row.map(returnOriginalIndexes),
                    winningType: 'horizontal',
                }
        }

        for (let i = 3 - 1; i >= 0; i--) {
            const verticalRow = cells
                .map(turnIntoValueAndIndex)
                .filter(({ originalIndex }) => originalIndex % 3 === i)

            if (verticalRow.every(cellValuesEqualK))
                return {
                    winner: k,
                    winningCells: verticalRow.map(returnOriginalIndexes),
                    winningType: 'vertical',
                }
        }

        const majorDiagonalRow = []
        for (let i = 0; i < 3; i++) {
            const index = i * 3 + i

            majorDiagonalRow.push({
                cellValue: cells[index],
                originalIndex: index,
            })
        }

        if (majorDiagonalRow.every(cellValuesEqualK)) {
            return {
                winner: k,
                winningCells: majorDiagonalRow.map(returnOriginalIndexes),
                winningType: 'majorDiagonal',
            }
        }

        const minorDiagonalRow = []
        for (let i = 1; i <= 3; i++) {
            const index = i * 3 - i

            minorDiagonalRow.push({
                cellValue: cells[index],
                originalIndex: index,
            })
        }

        if (minorDiagonalRow.every(cellValuesEqualK)) {
            return {
                winner: k,
                winningCells: minorDiagonalRow.map(returnOriginalIndexes),
                winningType: 'minorDiagonal',
            }
        }
    }

    return { winner: null, winningCells: [], winningType: null }
}
