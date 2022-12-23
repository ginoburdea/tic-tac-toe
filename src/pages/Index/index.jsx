import { doc, setDoc } from 'firebase/firestore'
import '../../assets/utils.scss'
import { roomsCollection } from '../../utils/firebase'
import { useNavigate } from 'react-router-dom'
import genRandomNumber from '../../utils/genRandomNumber'
import genGameData from '../../utils/genGameData'

const playSinglePlayer = async () => {}

const joinRoom = async () => {}

export default function IndexPage() {
    const navigate = useNavigate()

    const createRoom = async () => {
        const { roomId, gameData } = genGameData()
        
        await setDoc(doc(roomsCollection, roomId), gameData)

        navigate(`/play-multi-player/${roomId}`)
    }

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
