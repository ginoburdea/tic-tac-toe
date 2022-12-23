import genRandomNumber from './genRandomNumber'

export default function genGameData() {
    return {
        roomId: genRandomNumber(8),
        gameData: {
            cells: Array(9).fill(null),
            playersCount: 0,
            playerTurn: (genRandomNumber(1) % 2) + 1,
            winner: null,
            gameStatus: 'waiting-for-opponent',
            playerRestarting: null,
        },
    }
}
