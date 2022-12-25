import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import Table from '../../components/Table'
import { roomsCollection } from '../../utils/firebase'
import markCell from '../../utils/markCell'
import playAgain from './playAgain'
import { PlayerTurnMessage } from './PlayerTurnMessage'
import SomeoneWonMessage from './SomeoneWonMessage'
import { WaitingForOpponentMessage } from './WaitingForOpponentMessage'

export const getRoomData = async ({ params }) => {
    const roomRef = doc(roomsCollection, params.roomId)
    const roomSnap = await getDoc(roomRef)
    if (!roomSnap.exists()) throw new Error('Room not found')

    const roomData = roomSnap.data()
    const playerId = +localStorage.getItem('playerId')
    const roomId = localStorage.getItem('roomId')

    const playerHasAnId = roomId === params.roomId && playerId
    if (playerHasAnId) return null

    if (roomData.playersCount >= 2) throw new Error('Room is full')

    localStorage.setItem('playerId', roomData.playersCount + 1)
    localStorage.setItem('roomId', params.roomId)

    const playersCount = roomData.playersCount + 1
    const gameStatus = playersCount === 2 ? 'playing' : 'waiting-for-opponent'
    await setDoc(roomRef, { playersCount, gameStatus }, { merge: true })

    return null
}

export default function PlayMultiPlayerPage() {
    const [playerId, setPlayerId] = useState(+localStorage.getItem('playerId'))
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

            setPlayersCount(playersCount => {
                if (
                    roomData.gameStatus === 'waiting-for-opponent' &&
                    playersCount > roomData.playersCount &&
                    playerId === 2
                ) {
                    localStorage.setItem('playerId', 1)
                    setPlayerId(1)
                }

                return roomData.playersCount
            })
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
                    handleRestart={() =>
                        playAgain(roomId, playerId, gameStatus)
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
                    onCellClick={cellIndex =>
                        markCell(cellIndex, cells, roomId, playerId)
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
