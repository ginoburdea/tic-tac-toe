import './assets/styles/App.scss'
import { Outlet } from 'react-router-dom'

export default function App() {
    return (
        <div className="app mbc-4">
            <Outlet />
        </div>
    )
}
