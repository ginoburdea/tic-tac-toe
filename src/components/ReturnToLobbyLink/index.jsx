import { cloudLeaveRoom } from '@/utils/firebase'
import handleFirebaseError from '@/utils/handleFirebaseError'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router'

export default function ReturnToLobbyLink({ roomId }) {
    const navigate = useNavigate()

    const returnToLobby = async () => {
        await cloudLeaveRoom({ roomId }).catch(handleFirebaseError)

        localStorage.removeItem('roomId')
        localStorage.removeItem('playerId')
        navigate('/')
    }

    return (
        <a onClick={roomId ? returnToLobby : null} href={roomId ? null : '/'}>
            return to lobby
        </a>
    )
}

ReturnToLobbyLink.propTypes = {
    roomId: PropTypes.string,
}
