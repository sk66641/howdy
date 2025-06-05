import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../authSlice";
import { Navigate, useLocation } from "react-router-dom";

const Protected = ({ children }) => {
    const user = useSelector(selectLoggedInUser); 
    const location = useLocation();
    // console.log("preotected", user)
    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace/>;
    }

    return children;
}

export default Protected;