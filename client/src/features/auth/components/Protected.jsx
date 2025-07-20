import { Navigate, useLocation } from "react-router-dom";
import { useGetLoggedInUserQuery } from "../authApi2";

const Protected = ({ children }) => {
    const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();
    const location = useLocation();
    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}

export default Protected;   