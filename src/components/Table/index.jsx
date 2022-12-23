import './index.scss'
import '../../assets/utils.scss'
import PropTypes from 'prop-types'

export default function Table({ isPlayerTurn, cells, onCellClick }) {
    return (
        <div className="table gap-1">
            {cells.map((cell, index) => (
                <div
                    className={`table-cell ${
                        !cell && isPlayerTurn && 'can-click-it'
                    }`}
                    onClick={
                        !cell && isPlayerTurn ? () => onCellClick(index) : null
                    }
                    key={index}>
                    {cell && <h1>{cell === 1 ? 'x' : 'o'}</h1>}
                </div>
            ))}
        </div>
    )
}

Table.propTypes = {
    isPlayerTurn: PropTypes.bool.isRequired,
    cells: PropTypes.arrayOf(PropTypes.oneOf([1, 2, null])).isRequired,
    onCellClick: PropTypes.func.isRequired,
}
