import ReturnToLobbyLink from '../../components/ReturnToLobbyLink'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export default function SomeoneWonMessage({
    playerIsWinner,
    isTie,
    gameStatus,
    playerIsRestarting,
    roomId,
    handleRestart,
}) {
    const message = useMemo(
        () =>
            !isTie ? (playerIsWinner ? 'You won' : 'You lost') : 'Nobody won',
        [isTie, playerIsWinner]
    )

    return (
        <div className="text-center mbc-3">
            <h1>{message}</h1>

            {(gameStatus !== 'waiting-for-restart' ||
                (gameStatus === 'waiting-for-restart' &&
                    !playerIsRestarting)) && (
                <button onClick={handleRestart}>Play again</button>
                // <button onClick={() => playAgain(roomId, playerId, gameStatus)}>
                //     Play again
                // </button>
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
    isTie: PropTypes.bool.isRequired,
    gameStatus: PropTypes.string.isRequired,
    playerIsRestarting: PropTypes.bool.isRequired,
    roomId: PropTypes.string,
    handleRestart: PropTypes.func.isRequired,
}
