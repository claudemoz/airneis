import { useLocation } from "react-router-dom";
import "./components/FormLoginPage";
import FormLoginPage from "./components/FormLoginPage";

export default function LoginPage() {
  const location = useLocation();
  const from_path = location.state?.from_path 
  return (
    <>
      <FormLoginPage from_path={from_path}/>
    </>
  );
}
