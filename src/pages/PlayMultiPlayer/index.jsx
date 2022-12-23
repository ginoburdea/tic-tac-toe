import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLoaderData, useParams, useNavigate } from 'react-router-dom'
import ReturnToLobbyLink from '../../components/ReturnToLobbyLink'
import Table from '../../components/Table'
import batchesOf from '../../utils/batchesOf'
import { roomsCollection } from '../../utils/firebase'

const playAgain = async () => {}

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
        navigate(location.pathname)
    }

    return (
        <>
            {gameStatus == 'playing' && (
                <>
                    <Table
                        isPlayerTurn={playerTurn === playerId}
                        cells={cells}
                        onCellClick={markCell}
                    />
                    <p>
                        {playerTurn === playerId
                            ? "It's your turn"
                            : "It's your opponent's turn"}
                    </p>
                </>
            )}

            {gameStatus == 'someone-won' && (
                <>
                    <h1>{winner === playerId ? 'You won' : 'You lost'}</h1>
                    <button onClick={playAgain}>Play again</button>
                    <p>
                        Or <ReturnToLobbyLink roomId={roomId} />
                    </p>
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
