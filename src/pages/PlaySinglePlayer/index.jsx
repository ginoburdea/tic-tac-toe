import Table from '../../components/Table'

const playAgain = async () => {}

const markCell = async cellIndex => {
    console.log(cellIndex)
}

export default function PlaySinglePlayerPage() {
    /**
     * @type {'someone-won', 'playing'}
     */
    const gameStatus = 'playing'
    const cells = [1, null, 2, null, 1, 2, null, 2, 1]

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
            {/* {gameStatus === 'waiting-for-opponent' && <></>} */}
        </>
    )
}
