import { useEffect } from "react";
import { useWeb3Auth } from "./Web3AuthContext";

const ProtectedRoutes = (WrappedComponent: React.FC<any>) => {
  const HOC = (props: any) => {
    const { loggedIn, login } = useWeb3Auth(); 

    useEffect(() => {
      // Automatically log in if not already logged in
      if (!loggedIn) {
        login(); 
      }
    }, [loggedIn, login]);


    // If logged in, render the protected component
    return loggedIn ? <WrappedComponent {...props} /> : null;
  };

  return HOC;
};

export default ProtectedRoutes;
