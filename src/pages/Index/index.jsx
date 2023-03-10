import '@/assets/styles/utils.scss'
import { cloudCreateRoom, roomsCollection } from '@/utils/firebase'
import {
    Form,
    Link,
    redirect,
    useNavigate,
    useSearchParams,
} from 'react-router-dom'

export const indexPageAction = async ({ request }) => {
    const formData = await request.formData()
    const { formAction, ...data } = Object.fromEntries(formData)

    if (formAction === 'JOIN_ROOM') {
        return redirect(`/play-multi-player/${data.roomId}`)
    }
}

export default function IndexPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const createRoom = async () => {
        const { data } = await cloudCreateRoom({
            roomsCollection: roomsCollection.path,
        })
        navigate(`/play-multi-player/${data.roomId}`)
    }

    return (
        <>
            <h1>Tic-tac-toe</h1>

            <div className="mbc-2">
                <h3>Play single-player</h3>
                <Link to={'/play-single-player'}>
                    <button>Play now</button>
                </Link>
            </div>

            <div className="mbc-2">
                <h3>Play multi-player</h3>
                <div className="mbc-1">
                    <Form method="POST" className="display-flex gap-1">
                        <input
                            type="hidden"
                            name="formAction"
                            value="JOIN_ROOM"
                        />
                        <input
                            type="text"
                            placeholder="Room id"
                            name="roomId"
                        />
                        <button type="submit">Join</button>
                    </Form>
                    {searchParams.get('error') && (
                        <div className="color-danger">
                            {searchParams.get('error')}
                        </div>
                    )}
                </div>
                <p>
                    Or <a onClick={createRoom}>create a room</a>
                </p>
            </div>
        </>
    )
}
