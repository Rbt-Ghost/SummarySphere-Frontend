import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/authContext";

export default function RequireVerifiedEmail() {
  const { session } = useAuth();

  if (!session?.user?.emailVerified) {
    return <Navigate to="/" replace state={{ emailVerificationRequired: true }} />;
  }

  return <Outlet />;
}
