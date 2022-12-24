import './index.scss'
import '../../assets/utils.scss'
import { ReactComponent as XIcon } from '../../assets/x.svg'
import { ReactComponent as OIcon } from '../../assets/o.svg'
import { ReactComponent as LineIcon } from '../../assets/line.svg'
import { ReactComponent as DiagonalLineIcon } from '../../assets/diagonalLine.svg'
import PropTypes from 'prop-types'

export default function Table({
    isPlayerTurn,
    cells,
    onCellClick,
    winningCells,
    winningType,
}) {
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
                    {winningCells.indexOf(index) !== -1 &&
                        (winningType === 'horizontal' ||
                        winningType === 'vertical' ? (
                            <LineIcon
                                className="line-icon"
                                style={{
                                    transform: `rotate(${
                                        winningType === 'vertical'
                                            ? '90deg'
                                            : '0deg'
                                    })`,
                                }}
                            />
                        ) : (
                            <DiagonalLineIcon
                                className="line-icon"
                                style={{
                                    transform: `rotate(${
                                        winningType === 'minorDiagonal'
                                            ? '90deg'
                                            : '0deg'
                                    })`,
                                }}
                            />
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
    winningCells: PropTypes.arrayOf(PropTypes.number).isRequired,
    winningType: PropTypes.string,
}
