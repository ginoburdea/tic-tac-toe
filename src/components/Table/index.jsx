import './index.scss'
import '@/assets/utils.scss'
import { ReactComponent as XIcon } from '@/assets/x.svg'
import { ReactComponent as OIcon } from '@/assets/o.svg'
import { ReactComponent as LineIcon } from '@/assets/line.svg'
import { ReactComponent as DiagonalLineIcon } from '@/assets/diagonalLine.svg'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export default function Table({
    isPlayerTurn,
    cells,
    onCellClick,
    winningCells,
    winningType,
}) {
    const cellsData = useMemo(() => {
        return cells.map((cell, index) => {
            const userCanClickIt = !cell && isPlayerTurn
            const CellIconComponent = cell === 1 ? XIcon : OIcon

            let CellLineIcon = null
            const isWinningCell = winningCells.indexOf(index) !== -1
            if (isWinningCell) {
                const CellLineIconComponent =
                    winningType === 'minorDiagonal' ||
                    winningType === 'majorDiagonal'
                        ? DiagonalLineIcon
                        : LineIcon

                CellLineIcon = (
                    <CellLineIconComponent
                        className={`line-icon ${
                            winningType === 'minorDiagonal' ||
                            winningType === 'vertical'
                                ? 'rotate-90'
                                : ''
                        }`}
                    />
                )
            }

            return {
                className: `table-cell ${userCanClickIt ? 'can-click-it' : ''}`,
                handleClick: userCanClickIt ? () => onCellClick(index) : null,
                CellIcon: cell && <CellIconComponent className="cell-icon" />,
                CellLineIcon,
            }
        })
    }, [cells])

    return (
        <div className="table gap-1">
            {cellsData.map((cellData, index) => (
                <div
                    className={cellData.className}
                    onClick={cellData.handleClick}
                    key={index}>
                    {cellData.CellIcon}
                    {cellData.CellLineIcon}
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
