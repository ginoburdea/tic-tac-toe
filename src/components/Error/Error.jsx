import { useRouteError } from 'react-router'
import { Link } from 'react-router-dom'

export default function Error() {
    const error = useRouteError()

    return (
        <>
            <h1>Oops!</h1>
            <p>{error.message}</p>
            <Link to="/">
                <button>Return to lobby</button>
            </Link>
        </>
    )
}
