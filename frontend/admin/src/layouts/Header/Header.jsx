import { Card } from "antd";
import { Avatar, Dropdown } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsSun, BsMoon } from "react-icons/bs";
import { useEffect, useState } from "react";
import { fetchCurrentUser, forceLogout, logout } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";


export default function Header() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState("light");
  const items = [
    {
      key: '1',
      label: (<p onClick={() => dispatch(logout())}>Déconnexion</p>
      ),
    },
  ];
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      dispatch(forceLogout());
    }
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);
  
  return (
    <div className="col-start-2 col-span-1 row-start-1 row-end-2 items-center p-2 sticky top-0 z-10">
      <Card
        bordered={false}
        style={{ width: "100%" }}
        className="flex justify-end"
      >
        <div className="flex justify-center items-center space-x-2">
          {theme === "dark" ? (
            <BsSun
              size={20}
              className="cursor-pointer"
              onClick={() => setTheme("light")}
            />
          ) : (
            <BsMoon
              size={20}
              className="cursor-pointer"
              onClick={() => setTheme("dark")}
            />
          )}
          <IoMdNotificationsOutline size={28} className="cursor-pointer" />
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            arrow
          >
            <Avatar size={40} className="cursor-pointer">
                USER
              </Avatar>
          </Dropdown>
        </div>
      </Card>
    </div>
  );
}
