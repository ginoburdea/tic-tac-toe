import './index.scss'
import '../../assets/utils.scss'
import PropTypes from 'prop-types'

export default function Table({ cells, onCellClick }) {
    return (
        <div className="table gap-1">
            {cells.map((cell, index) => (
                <div
                    className={`table-cell ${!cell && 'can-click-it'}`}
                    key={index}
                    onClick={() => onCellClick(index)}>
                    {cell && <h1>{cell === 1 ? 'x' : 'o'}</h1>}
                </div>
            ))}
        </div>
    )
}

Table.propTypes = {
    cells: PropTypes.arrayOf(PropTypes.oneOf([1, 2, null])).isRequired,
    onCellClick: PropTypes.func.isRequired,
}
