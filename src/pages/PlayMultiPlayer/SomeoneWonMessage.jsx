import ReturnToLobbyLink from '../../components/ReturnToLobbyLink'
import PropTypes from 'prop-types'
import genGameData from '../../utils/genGameData'
import { doc, setDoc } from 'firebase/firestore'
import { roomsCollection } from '../../utils/firebase'

const playAgain = async (roomId, playerId, gameStatus) => {
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

export default function SomeoneWonMessage({
    playerIsWinner,
    gameStatus,
    playerIsRestarting,
    roomId,
    playerId,
}) {
    return (
        <div className="text-center mbc-3">
            <h1>{playerIsWinner ? 'You won' : 'You lost'}</h1>

            {(gameStatus !== 'waiting-for-restart' ||
                (gameStatus === 'waiting-for-restart' &&
                    !playerIsRestarting)) && (
                <button onClick={() => playAgain(roomId, playerId, gameStatus)}>
                    Play again
                </button>
            )}

            {gameStatus === 'waiting-for-restart' && !playerIsRestarting && (
                <p>
                    You've been challenged to another match. Click the button
                    above to start!
                </p>
            )}

            {gameStatus === 'waiting-for-restart' && playerIsRestarting && (
                <p>Waiting for your opponent to accept the restart...</p>
            )}

            <p>
                Or <ReturnToLobbyLink roomId={roomId} />
            </p>
        </div>
    )
}

SomeoneWonMessage.propTypes = {
    playerIsWinner: PropTypes.bool.isRequired,
    gameStatus: PropTypes.string.isRequired,
    playerIsRestarting: PropTypes.bool.isRequired,
    roomId: PropTypes.string.isRequired,
    playerId: PropTypes.number.isRequired,
}