import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/reset.scss'
import './assets/styles/index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import IndexPage, { indexPageAction } from './pages/Index'
import PlaySinglePlayerPage from './pages/PlaySinglePlayer'
import PlayMultiPlayerPage, { getRoomData } from './pages/PlayMultiPlayer'
import Error from './components/Error/Error'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <IndexPage />,
                action: indexPageAction,
            },
            { path: 'play-single-player', element: <PlaySinglePlayerPage /> },
            {
                path: 'play-multi-player/:roomId',
                element: <PlayMultiPlayerPage />,
                loader: getRoomData,
                errorElement: <Error />,
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <RouterProvider router={router} />
    </>
)
