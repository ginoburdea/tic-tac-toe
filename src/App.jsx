import { signInAnonymously } from 'firebase/auth'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import './assets/styles/App.scss'
import store from './store'
import { set } from './store/loadingSlice'
import { auth } from './utils/firebase'

export const logIn = async () => {
    await signInAnonymously(auth)
    store.dispatch(set(false))
    return {}
}

export default function App() {
    const loading = useSelector(state => state.loading.value)

    return (
        <>
            <div className="app mbc-4">
                <Outlet />
            </div>
            <div className={`loading-screen ${loading ? '' : 'is-hidden'}`}>
                <h2 className="text">Loading</h2>
            </div>
        </>
    )
}
