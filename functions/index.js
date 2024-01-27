import admin from 'firebase-admin'
// import functions from 'firebase-functions'
import { HttpsError, onCall } from 'firebase-functions/v2/https'

import { genGameData, getWinningInfo } from 'tic-tac-toe-common'

if (admin.apps.length === 0) {
    admin.initializeApp()
}

const corsConfig = {
    cors: ['tic-tac-toe-48116.netlify.app'],
}

export const createRoom = onCall(corsConfig, (data, context) => {
    const run = async () => {
        if (!context.auth?.uid) {
            throw new HttpsError('unauthenticated')
        }

        const { roomId, gameData } = genGameData()

        await admin
            .firestore()
            .collection('rooms')
            .doc('' + roomId)
            .set(gameData)
        return { roomId }
    }
    return run()
})

export const joinRoom = onCall(corsConfig, ({ roomId }, context) => {
    const run = async () => {
        if (!context.auth?.uid) {
            throw new HttpsError('unauthenticated')
        }

        const roomSnap = await admin
            .firestore()
            .collection('rooms')
            .doc('' + roomId)
            .get()

        if (!roomSnap.exists) {
            throw new HttpsError('invalid-argument', 'Room not found')
        }

        const roomData = roomSnap.data()

        const indexOfPlayerId = roomData.players.indexOf(context.auth.uid)
        if (indexOfPlayerId !== -1) {
            return { playerId: indexOfPlayerId + 1 }
        }

        const updatedPlayersCount = roomData.playersCount + 1
        await roomSnap.ref.update({
            playersCount: updatedPlayersCount,
            players: admin.firestore.FieldValue.arrayUnion(context.auth.uid),
            gameStatus:
                updatedPlayersCount === 2 ? 'playing' : 'waiting-for-opponent',
        })

        return { playerId: updatedPlayersCount }
    }
    return run()
})

export const leaveRoom = onCall(corsConfig, ({ roomId }, context) => {
    const run = async () => {
        if (!context.auth?.uid) {
            throw new HttpsError('unauthenticated')
        }

        const roomSnap = await admin
            .firestore()
            .collection('rooms')
            .doc('' + roomId)
            .get()

        if (!roomSnap.exists) {
            throw new HttpsError('invalid-argument', 'Room not found')
        }

        const { gameData } = genGameData()

        await roomSnap.ref.update({
            ...gameData,
            playersCount: admin.firestore.FieldValue.increment(-1),
            players: admin.firestore.FieldValue.arrayRemove(context.auth.uid),
        })
    }
    return run()
})

export const playAgain = onCall(corsConfig, ({ roomId }, context) => {
    const run = async () => {
        if (!context.auth?.uid) {
            throw new HttpsError('unauthenticated')
        }

        const roomSnap = await admin
            .firestore()
            .collection('rooms')
            .doc('' + roomId)
            .get()

        if (!roomSnap.exists) {
            throw new HttpsError('invalid-argument', 'Room not found')
        }

        const roomData = roomSnap.data()
        const { gameData } = genGameData()

        const updates = {}
        if (roomData.gameStatus === 'someone-won') {
            updates.gameStatus = 'waiting-for-restart'

            const playerId = roomData.players.indexOf(context.auth.uid) + 1
            updates.playerRestarting = playerId
        } else {
            updates.playerTurn = gameData.playerTurn
            updates.winner = gameData.winner
            updates.winningCells = gameData.winningCells
            updates.winningType = gameData.winningType
            updates.cells = gameData.cells
            updates.gameStatus = 'playing'
            updates.playerRestarting = gameData.playerRestarting
        }

        await roomSnap.ref.update(updates)
    }
    return run()
})

export const makeAMove = onCall(
    corsConfig,
    ({ roomId, cellIndex }, context) => {
        const run = async () => {
            if (!context.auth?.uid) {
                throw new HttpsError('unauthenticated')
            }

            const roomSnap = await admin
                .firestore()
                .collection('rooms')
                .doc('' + roomId)
                .get()

            if (!roomSnap.exists) {
                throw new HttpsError('invalid-argument', 'Room not found')
            }

            const roomData = roomSnap.data()
            const playerId = roomData.players.indexOf(context.auth.uid) + 1

            roomData.cells[cellIndex] = +playerId

            const { winningCells, winningType } = getWinningInfo(
                roomData.cells,
                playerId
            )

            const updatedData = {
                cells: roomData.cells,
                playerTurn: playerId === 1 ? 2 : 1,
            }
            if (winningType) {
                updatedData.winner = playerId
                updatedData.winningCells = winningCells
                updatedData.winningType = winningType
                updatedData.gameStatus = 'someone-won'
            }

            await roomSnap.ref.update(updatedData)
        }
        return run()
    }
)
