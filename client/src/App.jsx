import { Button } from "@/components/ui/button"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { checkTokenAsync, selectLoggedInUser } from "./features/auth/authSlice"
import Protected from "./features/auth/components/Protected"
import ChatPage from "./pages/ChatPage"
import ProfilePage from "./pages/ProfilePage"
import AuthPage from "./pages/AuthPage"
// shadcn is a rapper over radix-ui

function App() {
  const routes = [
    {
      path: '/auth',
      element: <AuthPage />,
    },
    {
      path: '/',
      element: <Protected><ChatPage/></Protected>,
    },
    {
      path: '/profile',
      element: <ProfilePage />,
    },
    {
      path: '*',
      element: <Navigate to={'/auth'} replace />
    }
  ]

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkTokenAsync());
  }, [dispatch])

  // const user = useSelector(selectLoggedInUser);

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