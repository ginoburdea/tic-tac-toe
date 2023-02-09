import PlayerTurnMessage from '@/components/PlayerTurnMessage'
import SomeoneWonMessage from '@/components/SomeoneWonMessage'
import Table from '@/components/Table'
import {
    auth,
    cloudJoinRoom,
    cloudMakeAMove,
    cloudPlayAgain,
    roomsCollection,
} from '@/utils/firebase'
import handleFirebaseError from '@/utils/handleFirebaseError'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import WaitingForOpponentMessage from './WaitingForOpponentMessage'

export const getRoomData = async ({ params }) => {
    const { data } = await cloudJoinRoom({ roomId: params.roomId }).catch(
        handleFirebaseError
    )

    localStorage.setItem('playerId', data.playerId)
    localStorage.setItem('roomId', params.roomId)
    return null
}

export default function PlayMultiPlayerPage() {
    const [playerId, setPlayerId] = useState(+localStorage.getItem('playerId'))
    useEffect(() => {
        localStorage.setItem('playerId', playerId)
    }, [playerId])

    const { roomId } = useParams()

    const [cells, setCells] = useState([])
    const [playerTurn, setPlayerTurn] = useState(null)
    const [gameStatus, setGameStatus] = useState('')
    const [winner, setWinner] = useState(null)
    const [playerRestarting, setPlayerRestarting] = useState(null)
    const [winningCells, setWinningCells] = useState([])
    const [winningType, setWinningType] = useState(null)
    const [, setPlayersCount] = useState(null)

    useEffect(() => {
        const roomRef = doc(roomsCollection, roomId)
        const unsubscribe = onSnapshot(roomRef, roomSnap => {
            const roomData = roomSnap.data()

            setCells(roomData.cells)
            setPlayerTurn(roomData.playerTurn)
            setGameStatus(roomData.gameStatus)
            setWinner(roomData.winner)
            setWinningCells(roomData.winningCells)
            setWinningType(roomData.winningType)
            setPlayerRestarting(roomData.playerRestarting)
            setPlayerId(roomData.players.indexOf(auth.currentUser.uid) + 1)
            setPlayersCount(roomData.playersCount)
        })

        return unsubscribe
    }, [])

    return (
        <>
            {(gameStatus === 'someone-won' ||
                gameStatus === 'waiting-for-restart') && (
                <SomeoneWonMessage
                    playerIsWinner={winner === playerId}
                    isTie={winningType === 'tie'}
                    gameStatus={gameStatus}
                    playerIsRestarting={playerRestarting === playerId}
                    roomId={roomId}
                    handleRestart={async () =>
                        await cloudPlayAgain({ roomId }).catch(
                            handleFirebaseError
                        )
                    }
                />
            )}

            {gameStatus === 'playing' && (
                <PlayerTurnMessage isPlayersTurn={playerTurn === playerId} />
            )}

            {gameStatus !== 'waiting-for-opponent' && (
                <Table
                    isPlayerTurn={
                        gameStatus === 'playing' && playerTurn === playerId
                    }
                    cells={cells}
                    onCellClick={async cellIndex =>
                        await cloudMakeAMove({ roomId, cellIndex }).catch(
                            handleFirebaseError
                        )
                    }
                    winningCells={winningCells}
                    winningType={winningType}
                />
            )}

            {gameStatus === 'waiting-for-opponent' && (
                <WaitingForOpponentMessage roomId={roomId} />
            )}
        </>
    )
}
