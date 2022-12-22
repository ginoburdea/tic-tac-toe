import Table from '../../components/Table'

const playAgain = async () => {}

const markCell = async cellIndex => {
    console.log(cellIndex)
}

export default function PlayMultiPlayerPage() {
    /**
     * @type {'opponents-turn', 'your-turn', 'opponent-won', 'you-won', 'waiting-for-opponent'}
     */
    const gameStatus = 'opponent-won'
    const cells = ['x', null, 'o', null, 'x', 'o', null, 'o', 'x']
    const roomId = '123434'

    return (
        <>
            {(gameStatus == 'opponents-turn' || gameStatus == 'your-turn') && (
                <>
                    <Table cells={cells} onCellClick={markCell} />
                    <p>
                        {gameStatus === 'opponents-turn'
                            ? "It's your opponent's turn"
                            : "It's your turn"}
                    </p>
                </>
            )}

            {(gameStatus == 'opponent-won' || gameStatus == 'you-won') && (
                <>
                    <h1>
                        {gameStatus == 'opponent-won' ? 'You lost' : 'You won'}
                    </h1>
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
