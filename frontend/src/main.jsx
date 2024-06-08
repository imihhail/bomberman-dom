import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Container from './items/RootContainer/Container';
import ErrorPage from './items/RootContainer/ErrorPage';
import Profile from './items/Profile/Profile';
import Posts from './items/Posts/Posts';
import Chat from './items/Chat/Chat';
import Groups from './items/Groups/Groups';
import Games from './items/Games/Games';
import Notifications from './items/Notifications/Notifications.jsx';
import InitTetris from './items/Games/GamePool/Tetris/InitTetris.jsx';
import BombermanLobby from './items/Games/GamePool/Bomberman/BombermanLobby.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/notifications',
        element: <Notifications />,
      },
      {
        path: '/posts',
        element: <Posts />,
      },
      {
        path: '/groups',
        element: <Groups />,
      },
      {
        path: '/games',
        element: <Games />,
        children: [
          {
            path: '/games/tetris',
            element: <InitTetris />,
          },
          {
            path: '/games/bomberman',
            element: <BombermanLobby />,
          },
        ],
      },
      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/profile/:id',
        element: <Profile />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);
