import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLoaderData, useParams, useNavigate } from 'react-router-dom'
import ReturnToLobbyLink from '../../components/ReturnToLobbyLink'
import Table from '../../components/Table'
import batchesOf from '../../utils/batchesOf'
import { roomsCollection } from '../../utils/firebase'
import genGameData from '../../utils/genGameData'

const playAgain = async (roomId, playerId, gameStatus) => {
    const { gameData } = genGameData()

    const updates = {}
    if (gameStatus === 'someone-won') {
        updates.gameStatus = 'waiting-for-restart'
        updates.playerRestarting = playerId
    } else {
        updates.playerTurn = gameData.playerTurn
        updates.winner = gameData.winner
        updates.cells = gameData.cells
        updates.gameStatus = 'playing'
        updates.playerRestarting = gameData.playerRestarting
    }

    await setDoc(doc(roomsCollection, roomId), updates, { merge: true })
}

export const getRoomData = async ({ params }) => {
    const roomRef = doc(roomsCollection, params.roomId)
    const roomSnap = await getDoc(roomRef)
    if (!roomSnap.exists()) throw new Error('Room not found')

    const roomData = roomSnap.data()
    const playerId = +localStorage.getItem('playerId')
    const roomId = localStorage.getItem('roomId')

    const playerHasAnId = roomId === params.roomId && playerId
    if (playerHasAnId) return { playerId }

    if (roomData.playersCount >= 2) throw new Error('Room is full')

    localStorage.setItem('playerId', roomData.playersCount + 1)
    localStorage.setItem('roomId', params.roomId)

    const playersCount = roomData.playersCount + 1
    const gameStatus = playersCount === 2 ? 'playing' : 'waiting-for-opponent'
    await setDoc(roomRef, { playersCount, gameStatus }, { merge: true })

    return { playerId: playersCount }
}

const getWinner = cells => {
    for (let k of [1, 2]) {
        const horizontalRows = batchesOf(cells, 3)
        for (const row of horizontalRows) {
            if (row.every(cell => cell === k)) return k
        }

        const verticalRows = []
        for (let i = 3 - 1; i >= 0; i--) {
            verticalRows.push(cells.filter((cell, index) => index % 3 === i))
        }
        for (const row of verticalRows) {
            if (row.every(cell => cell === k)) return k
        }

        const diagonalCells = []
        for (let i = 0; i < 3; i++) diagonalCells.push(cells[i * 3 + i])
        for (let i = 1; i <= 3; i++) diagonalCells.push(cells[i * 3 - i])

        const diagonalRows = batchesOf(diagonalCells, 3)
        for (const row of diagonalRows) {
            if (row.every(cell => cell === k)) return k
        }
    }

    return null
}

export default function PlayMultiPlayerPage() {
    const { playerId } = useLoaderData()
    const { roomId } = useParams()

    const [cells, setCells] = useState([])
    const [playerTurn, setPlayerTurn] = useState(null)
    const [gameStatus, setGameStatus] = useState('')
    const [winner, setWinner] = useState(null)
    const [playerRestarting, setPlayerRestarting] = useState(null)

    useEffect(() => {
        localStorage.setItem('playerId', playerId)
        localStorage.setItem('roomId', roomId)

        const roomRef = doc(roomsCollection, roomId)
        const unsubscribe = onSnapshot(roomRef, roomSnap => {
            const roomData = roomSnap.data()

            setCells(roomData.cells)
            setPlayerTurn(roomData.playerTurn)
            setGameStatus(roomData.gameStatus)
            setWinner(roomData.winner)
            setPlayerRestarting(roomData.playerRestarting)
        })

        return unsubscribe
    }, [])
    const navigate = useNavigate()

    const markCell = async cellIndex => {
        cells[cellIndex] = +playerId

        const winner = getWinner(cells)

        const updatedData = {
            cells,
            playerTurn: playerId === 1 ? 2 : 1,
        }
        if (winner) {
            updatedData.winner = winner
            updatedData.gameStatus = 'someone-won'
        }

        await setDoc(doc(roomsCollection, roomId), updatedData, { merge: true })
    }

    return (
        <>
            {(gameStatus === 'someone-won' ||
                gameStatus === 'waiting-for-restart') && (
                <div className="text-center mbc-3">
                    <h1>{winner === playerId ? 'You won' : 'You lost'}</h1>
                    {(gameStatus !== 'waiting-for-restart' ||
                        (gameStatus === 'waiting-for-restart' &&
                            playerRestarting !== playerId)) && (
                        <button
                            onClick={() =>
                                playAgain(roomId, playerId, gameStatus)
                            }>
                            Play again
                        </button>
                    )}

                    {gameStatus === 'waiting-for-restart' &&
                        playerRestarting !== playerId && (
                            <p>
                                You've been challenged to another match. Click
                                the button above to start!
                            </p>
                        )}

                    {gameStatus === 'waiting-for-restart' &&
                        playerRestarting === playerId && (
                            <p>
                                Waiting for your opponent to accept the
                                restart...
                            </p>
                        )}
                    <p>
                        Or <ReturnToLobbyLink roomId={roomId} />
                    </p>
                </div>
            )}

            {(gameStatus === 'playing' ||
                gameStatus === 'someone-won' ||
                gameStatus === 'waiting-for-restart') && (
                <>
                    {gameStatus === 'playing' && (
                        <h1 className="text-center text-bold">
                            {playerTurn === playerId
                                ? "It's your turn"
                                : "It's your opponent's turn"}
                        </h1>
                    )}
                    <Table
                        isPlayerTurn={
                            gameStatus === 'playing' && playerTurn === playerId
                        }
                        cells={cells}
                        onCellClick={markCell}
                    />
                </>
            )}

            {gameStatus === 'waiting-for-opponent' && (
                <>
                    <h1>Room id: {roomId}</h1>
                    <p>Share the room id with a friend to play together</p>
                    <p>
                        Or <ReturnToLobbyLink roomId={roomId} />
                    </p>
                </>
            )}
        </>
    )
}
