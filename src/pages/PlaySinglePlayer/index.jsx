import PlayerTurnMessage from '@/components/PlayerTurnMessage'
import SomeoneWonMessage from '@/components/SomeoneWonMessage'
import Table from '@/components/Table'
import { genGameData, getWinningInfo } from 'tic-tac-toe-common'

import { useEffect, useState } from 'react'

export default function PlaySinglePlayerPage() {
    const { gameData } = genGameData()

    const playerId = 1
    const [cells, setCells] = useState(gameData.cells)
    const [playerTurn, setPlayerTurn] = useState(gameData.playerTurn)
    const [gameStatus, setGameStatus] = useState('playing')
    const [winner, setWinner] = useState(gameData.winner)
    const [winningCells, setWinningCells] = useState(gameData.winningCells)
    const [winningType, setWinningType] = useState(gameData.winningType)

    const markCell = (cellIndex, playerId) => {
        setCells(cells => {
            const updatedCells = [...cells]
            updatedCells[cellIndex] = playerId

            return updatedCells
        })
        setPlayerTurn(playerId === 1 ? 2 : 1)
    }

    const makeBotMarkCell = async () => {
        await new Promise(resolve => setTimeout(resolve, 500))

        const emptyCellIndexes = cells
            .map((cellValue, originalIndex) => ({
                cellValue,
                originalIndex,
            }))
            .filter(({ cellValue }) => !cellValue)
            .map(({ originalIndex }) => originalIndex)
        const randomIndex = Math.floor(Math.random() * emptyCellIndexes.length)

        markCell(emptyCellIndexes[randomIndex], 2)
    }

    const playAgain = () => {
        const { gameData } = genGameData()

        setCells(gameData.cells)
        setPlayerTurn(gameData.playerTurn)
        setGameStatus('playing')
        setWinner(gameData.winner)
        setWinningCells(gameData.winningCells)
        setWinningType(gameData.winningType)
    }

    useEffect(() => {
        for (const id of [1, 2]) {
            const { winningCells, winningType } = getWinningInfo(cells, id)
            if (winningType) {
                setGameStatus('someone-won')
                setWinner(id)
                setWinningCells(winningCells)
                setWinningType(winningType)
                return
            }
        }

        if (playerTurn === playerId || gameStatus !== 'playing') return
        makeBotMarkCell()
    }, [cells])

    return (
        <>
            {gameStatus === 'someone-won' && (
                <SomeoneWonMessage
                    playerIsWinner={winner === playerId}
                    isTie={winningType === 'tie'}
                    gameStatus={gameStatus}
                    playerIsRestarting={false}
                    handleRestart={playAgain}
                />
            )}

            {gameStatus === 'playing' && (
                <PlayerTurnMessage isPlayersTurn={playerTurn === playerId} />
            )}

            <Table
                isPlayerTurn={
                    gameStatus === 'playing' && playerTurn === playerId
                }
                cells={cells}
                onCellClick={cellIndex => {
                    markCell(cellIndex, playerId)
                }}
                winningCells={winningCells}
                winningType={winningType}
            />
        </>
    )
}
