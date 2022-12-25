import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'
import { doc, increment, setDoc } from '@firebase/firestore'
import { roomsCollection } from '../../utils/firebase'
import genGameData from '../../utils/genGameData'

export default function ReturnToLobbyLink({ roomId }) {
    const navigate = useNavigate()

    const returnToLobby = async () => {
        const roomRef = doc(roomsCollection, roomId)

        const { gameData } = genGameData()
        const { playersCount, playerTurn, ...newGameData } = gameData

        await setDoc(
            roomRef,
            {
                ...newGameData,
                playersCount: increment(-1),
            },
            { merge: true }
        )

        localStorage.removeItem('roomId')
        localStorage.removeItem('playerId')
        navigate('/')
    }

    return <a onClick={returnToLobby}>return to lobby</a>
}

ReturnToLobbyLink.propTypes = {
    roomId: PropTypes.string.isRequired,
}
