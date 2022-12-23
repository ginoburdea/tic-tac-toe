import { doc, getDoc, increment, setDoc } from 'firebase/firestore'
import { redirect, useLoaderData } from 'react-router-dom'
import Table from '../../components/Table'
import { roomsCollection } from '../../utils/firebase'

const playAgain = async () => {}

const markCell = async cellIndex => {
    console.log(cellIndex)
}

export const getRoomData = async ({ params }) => {
    const roomDoc = doc(roomsCollection, params.roomId)
    const roomSnap = await getDoc(roomDoc)
    if (!roomSnap.exists()) throw redirect('/')

    const roomData = roomSnap.data()
    const gameStatus =
        roomData.playersCount === 0 ? 'waiting-for-opponent' : 'playing'
    const playerId = roomData.playersCount + 1

    await setDoc(
        roomDoc,
        { playersCount: increment(1), gameStatus },
        { merge: true }
    )

    return {
        roomId: roomSnap.id,
        cells: roomData.cells,
        playerTurn: roomData.playerTurn,
        gameStatus,
        playerId,
    }
}

export default function PlayMultiPlayerPage() {
    const { roomId, cells, playerTurn, gameStatus, playerId } = useLoaderData()

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
