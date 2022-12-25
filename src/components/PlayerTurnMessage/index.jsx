import PropTypes from 'prop-types'

export default function PlayerTurnMessage({ isPlayersTurn }) {
    return (
        <h1 className="text-center text-bold">
            {isPlayersTurn ? "It's your turn" : "It's your opponent's turn"}
        </h1>
    )
}

PlayerTurnMessage.propTypes = {
    isPlayersTurn: PropTypes.bool.isRequired,
}
