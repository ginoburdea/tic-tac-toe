import '../../assets/utils.scss'

const playSinglePlayer = async () => {}

const joinRoom = async () => {}

const createRoom = async () => {}

export default function IndexPage() {
    return (
        <>
            <h1>Tic-tac-toe</h1>

            <div className="mbc-2">
                <h3>Play single-player</h3>
                <button onClick={playSinglePlayer}>Play now</button>
            </div>

            <div className="mbc-2">
                <h3>Play multi-player</h3>
                <div className="display-flex gap-1">
                    <input type="text" placeholder="Room id" />
                    <button onClick={joinRoom}>Join</button>
                </div>
                <p>
                    Or <a onClick={createRoom}>create a room</a>
                </p>
            </div>
        </>
    )
}
