import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'
import { doc, increment, setDoc } from '@firebase/firestore'
import { roomsCollection } from '../../utils/firebase'

export default function ReturnToLobbyLink({ roomId }) {
    const navigate = useNavigate()

    const returnToLobby = async () => {
        const roomRef = doc(roomsCollection, roomId)
        await setDoc(
            roomRef,
            {
                gameStatus: 'waiting-for-opponent',
                playersCount: increment(-1),
            },
            { merge: true }
        )

        navigate('/')
    }

    return <a onClick={returnToLobby}>return to lobby</a>
}

ReturnToLobbyLink.propTypes = {
    roomId: PropTypes.string.isRequired,
}
