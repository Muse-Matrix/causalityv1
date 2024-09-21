import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Auth } from "./Web3AuthContext";// Assuming you have Web3Auth context set up

const ProtectedRoutes = (WrappedComponent: React.FC<any>) => {
  const HOC = (props: any) => {
    const { loggedIn, login } = useWeb3Auth(); // Access login state from context
    const router = useRouter();

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
