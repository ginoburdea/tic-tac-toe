import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App, { logIn } from './App'
import './assets/styles/a-reset.scss'
import './assets/styles/index.scss'
import Error from './components/Error/Error'
import IndexPage, { indexPageAction } from './pages/Index'
import PlayMultiPlayerPage, { getRoomData } from './pages/PlayMultiPlayer'
import PlaySinglePlayerPage from './pages/PlaySinglePlayer'
import store from './store'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        loader: logIn,
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
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
)
