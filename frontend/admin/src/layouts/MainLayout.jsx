/* eslint-disable react/prop-types */
import { useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";

export default function Layout({ children }) {
  
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log("isAuthenticated ", isAuthenticated);
  return (
    <>
    <Toaster expand={false} visibleToasts={1} richColors />
      {
        isAuthenticated 
        ? 
        (
          <div className="h-screen grid grid-cols-[250px_auto] grid-rows-[80px_auto]">
            <Sidebar />
            <Header />
            <main className="col-start-2 row-start-2 row-end-3 p-2 mt-4">
              {children}
            </main>
          </div>
        ) 
        : (<div className="h-screen flex justify-center items-center">
          <div className="w-3/4 bg-[rgb(71,85,105)] h-full flex justify-center items-center">
          <div>
            <h1 className="text-4xl text-white font-bold">Bienvenue sur l'interface admin Airneis</h1>
            <h3 className="text-white">Connectez-vous !</h3>
          </div>
          </div>
          <div className="w-2/4 h-full flex justify-center items-center">{children}</div>
        </div>)
      }
    </>
  );
}
