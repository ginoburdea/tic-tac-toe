import genGameData from '../../utils/genGameData'
import { doc, setDoc } from 'firebase/firestore'
import { roomsCollection } from '../../utils/firebase'

export default async function playAgain(roomId, playerId, gameStatus) {
    const { gameData } = genGameData()

    const updates = {}
    if (gameStatus === 'someone-won') {
        updates.gameStatus = 'waiting-for-restart'
        updates.playerRestarting = playerId
    } else {
        updates.playerTurn = gameData.playerTurn
        updates.winner = gameData.winner
        updates.winningCells = gameData.winningCells
        updates.winningType = gameData.winningType
        updates.cells = gameData.cells
        updates.gameStatus = 'playing'
        updates.playerRestarting = gameData.playerRestarting
    }

    await setDoc(doc(roomsCollection, roomId), updates, { merge: true })
}
