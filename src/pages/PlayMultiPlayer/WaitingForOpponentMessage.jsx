import PropTypes from 'prop-types'
import ReturnToLobbyLink from '@/components/ReturnToLobbyLink'

export default function WaitingForOpponentMessage({ roomId }) {
    return (
        <>
            <h1>Room id: {roomId}</h1>
            <p>Share the room id with a friend to play together</p>
            <p>
                Or <ReturnToLobbyLink roomId={roomId} />
            </p>
        </>
    )
}

WaitingForOpponentMessage.propTypes = {
    roomId: PropTypes.string.isRequired,
}
