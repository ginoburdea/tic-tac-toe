import { doc, getDoc, increment, setDoc } from 'firebase/firestore'
import { redirect, useLoaderData, useNavigate } from 'react-router-dom'
import Table from '../../components/Table'
import { roomsCollection } from '../../utils/firebase'

const playAgain = async () => {}

export const getRoomData = async ({ params }) => {
    const roomDoc = doc(roomsCollection, params.roomId)
    const roomSnap = await getDoc(roomDoc)
    if (!roomSnap.exists()) throw redirect('/')

    const roomId = roomSnap.id
    const roomData = roomSnap.data()
    const gameStatus =
        roomData.playersCount === 0 ? 'waiting-for-opponent' : 'playing'

    const playerIds = JSON.parse(localStorage.getItem('playerIds')) || {}
    console.log(playerIds)

    let playerId
    if (playerIds[roomId]) {
        playerId = playerIds[roomId]
    } else {
        // something is wrong here
        playerId = roomData.playersCount + 1
        localStorage.setItem(
            'playerIds',
            JSON.stringify({ ...playerIds, [roomId]: playerId })
        )
    }

    await setDoc(
        roomDoc,
        {
            playersCount:
                roomData.playersCount < 2 ? increment(1) : increment(0),
            gameStatus,
        },
        { merge: true }
    )

    return {
        roomId,
        cells: roomData.cells,
        playerTurn: roomData.playerTurn,
        gameStatus,
        playerId,
    }
}

export default function PlayMultiPlayerPage() {
    const { roomId, cells, playerTurn, gameStatus, playerId } = useLoaderData()
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
