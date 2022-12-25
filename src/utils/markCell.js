import { doc, setDoc } from 'firebase/firestore'
import { roomsCollection } from './firebase'
import getWinningInfo from './getWinningInfo'

export default async function markCell(cellIndex, cells, roomId, playerId) {
    cells[cellIndex] = +playerId

    const { winningCells, winningType } = getWinningInfo(cells, playerId)

    const updatedData = {
        cells,
        playerTurn: playerId === 1 ? 2 : 1,
    }
    if (winningType) {
        updatedData.winner = playerId
        updatedData.winningCells = winningCells
        updatedData.winningType = winningType
        updatedData.gameStatus = 'someone-won'
    }

    await setDoc(doc(roomsCollection, roomId), updatedData, { merge: true })
}
