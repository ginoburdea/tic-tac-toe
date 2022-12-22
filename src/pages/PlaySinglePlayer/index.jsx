import Table from '../../components/Table'

const playAgain = async () => {}

const markCell = async cellIndex => {
    console.log(cellIndex)
}

export default function PlaySinglePlayerPage() {
    /**
     * @type {'opponents-turn', 'your-turn', 'opponent-won', 'you-won', 'waiting-for-opponent'}
     */
    const gameStatus = 'opponents-turn'
    const cells = ['x', null, 'o', null, 'x', 'o', null, 'o', 'x']

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

            {/* {gameStatus === 'waiting-for-opponent' && <></>} */}
        </>
    )
}
