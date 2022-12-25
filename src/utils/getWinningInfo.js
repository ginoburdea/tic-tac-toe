import batchesOf from './batchesOf'

export default function getWinningInfo(cells, playerId) {
    const turnIntoValueAndIndex = (cellValue, originalIndex) => ({
        cellValue,
        originalIndex,
    })
    const returnOriginalIndexes = ({ originalIndex }) => originalIndex
    const cellValuesEqualPlayerId = ({ cellValue }) => cellValue === playerId

    const horizontalRows = batchesOf(cells.map(turnIntoValueAndIndex), 3)
    for (const row of horizontalRows) {
        if (row.every(cellValuesEqualPlayerId))
            return {
                winningCells: row.map(returnOriginalIndexes),
                winningType: 'horizontal',
            }
    }

    for (let i = 3 - 1; i >= 0; i--) {
        const verticalRow = cells
            .map(turnIntoValueAndIndex)
            .filter(({ originalIndex }) => originalIndex % 3 === i)

        if (verticalRow.every(cellValuesEqualPlayerId))
            return {
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

    if (majorDiagonalRow.every(cellValuesEqualPlayerId)) {
        return {
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

    if (minorDiagonalRow.every(cellValuesEqualPlayerId)) {
        return {
            winningCells: minorDiagonalRow.map(returnOriginalIndexes),
            winningType: 'minorDiagonal',
        }
    }

    if (cells.filter(cell => cell).length === 9) {
        return {
            winningCells: [],
            winningType: 'tie',
        }
    }

    return {
        winningCells: [],
        winningType: null,
    }
}
