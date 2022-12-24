import './index.scss'
import '../../assets/utils.scss'
import { ReactComponent as XIcon } from '../../assets/x.svg'
import { ReactComponent as OIcon } from '../../assets/o.svg'
import PropTypes from 'prop-types'

export default function Table({ isPlayerTurn, cells, onCellClick }) {
    return (
        <div className="table gap-1">
            {cells.map((cell, index) => (
                <div
                    className={`table-cell ${
                        !cell && isPlayerTurn ? 'can-click-it' : ''
                    }`}
                    onClick={
                        !cell && isPlayerTurn ? () => onCellClick(index) : null
                    }
                    key={index}>
                    {cell &&
                        (cell === 1 ? (
                            <XIcon className="cell-icon" />
                        ) : (
                            <OIcon className="cell-icon" />
                        ))}
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
