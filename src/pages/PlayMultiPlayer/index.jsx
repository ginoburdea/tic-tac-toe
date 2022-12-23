import { doc, getDoc, increment, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { redirect, useLoaderData, useParams, useNavigate } from 'react-router-dom'
import Table from '../../components/Table'
import { roomsCollection } from '../../utils/firebase'

const playAgain = async () => {}

export const getRoomData = async ({ params }) => {
    const roomRef = doc(roomsCollection, params.roomId)
    const roomSnap = await getDoc(roomRef)
    if (!roomSnap.exists()) throw new Error('Room not found')

    const roomId = roomSnap.id
    const roomData = roomSnap.data()
    if (roomData.playersCount >= 2) throw new Error('Room is full')

    const updatedPlayersCount = roomData.playersCount + 1
    await setDoc(
        roomRef,
        {
            playersCount: updatedPlayersCount,
            gameStatus:
                updatedPlayersCount === 2 ? 'playing' : 'waiting-for-opponent',
        },
        { merge: true }
    )

    return { playerId: roomData.playersCount + 1 }
}

export default function PlayMultiPlayerPage() {
    const { playerId } = useLoaderData()
    const { roomId } = useParams()

    const [cells, setCells] = useState([])
    const [playerTurn, setPlayerTurn] = useState(0)
    const [gameStatus, setGameStatus] = useState('')

    useEffect(() => {
        const roomRef = doc(roomsCollection, roomId)
        const unsubscribe = onSnapshot(roomRef, roomSnap => {
            const roomData = roomSnap.data()
            console.log(roomData)

            setCells(roomData.cells)
            setPlayerTurn(roomData.playerTurn)
            setGameStatus(roomData.gameStatus)
        })

        return unsubscribe
    }, [])
    const navigate = useNavigate()

    const markCell = async cellIndex => {
        cells[cellIndex] = playerId
        await setDoc(doc(roomsCollection, roomId), { cells }, { merge: true })
        navigate(location.pathname)
    }

    return (
        <>
            {gameStatus == 'playing' && (
                <>
                    <Table cells={cells} onCellClick={markCell} />
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
                        Or <a href="/">return to lobby</a>
                    </p>
                </>
            )}

            {gameStatus === 'waiting-for-opponent' && (
                <>
                    <h1>Room id: {roomId}</h1>
                    <p>Share the room id with a friend to play together</p>
                    <p>
                        Or <a href="/">return to lobby</a>
                    </p>
                </>
            )}
        </>
    )
}
