import { Button } from "@/components/ui/button"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Protected from "./features/auth/components/Protected"
import ChatPage from "./pages/ChatPage"
import ProfilePage from "./pages/ProfilePage"
import AuthPage from "./pages/AuthPage"
import ChannelProfile from "./features/profile/ChannelProfile"
// import ChatHtml from "./features/chat/ChatHtml"
// import { getChannelsAsync } from "./features/chat/chatSlice"
// shadcn is a rapper over radix-ui

function App() {
  const routes = [
    {
      path: '/auth',
      element: <AuthPage />,
    },
    {
      path: '/',
      element: <Protected><ChatPage /></Protected>,
    },
    // {
    //   path: '/profile',
    //   element: <Protected> <ProfilePage /></Protected>,
    // },
    // {
    //   path: '/channel-profile',
    //   element: <Protected> <ChannelProfile /></Protected>,
    // },
    {
      path: '*',
      element: <Navigate to={'/auth'} replace />
    },
  ]



  return (

    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App