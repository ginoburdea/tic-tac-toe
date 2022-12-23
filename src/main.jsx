import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/reset.scss'
import './assets/index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import IndexPage from './pages/Index'
import PlaySinglePlayerPage from './pages/PlaySinglePlayer'
import PlayMultiPlayerPage, { getRoomData } from './pages/PlayMultiPlayer'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <IndexPage /> },
            { path: 'play-single-player', element: <PlaySinglePlayerPage /> },
            {
                path: 'play-multi-player/:roomId',
                element: <PlayMultiPlayerPage />,
                loader: getRoomData,
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
