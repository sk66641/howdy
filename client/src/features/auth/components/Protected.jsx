import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../authSlice";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
    const user = useSelector(selectLoggedInUser); 
    // console.log("preotected", user)
    if (!user) {
        return <Navigate to={'/auth'} replace={true}></Navigate>;
    }
    return children;
}

export default Protected;