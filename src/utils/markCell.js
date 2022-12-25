import { doc, setDoc } from 'firebase/firestore'
import { roomsCollection } from './firebase'
import getWinningInfo from './getWinningInfo'

export default async function markCell(cellIndex, cells, roomId, playerId) {
    cells[cellIndex] = +playerId

    const { winner, winningCells, winningType } = getWinningInfo(cells)

    const updatedData = {
        cells,
        playerTurn: playerId === 1 ? 2 : 1,
    }
    if (winner) {
        updatedData.winner = winner
        updatedData.winningCells = winningCells
        updatedData.winningType = winningType
        updatedData.gameStatus = 'someone-won'
    }

    await setDoc(doc(roomsCollection, roomId), updatedData, { merge: true })
}
