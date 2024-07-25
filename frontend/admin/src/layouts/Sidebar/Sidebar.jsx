import { BiHomeAlt } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
// import { FiTag } from "react-icons/fi";
import { BsTags } from "react-icons/bs";
import { CiDeliveryTruck } from "react-icons/ci";
import { CgScreen } from "react-icons/cg";
import { MdMailOutline } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
// import { TbTruckDelivery } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { user  } = useSelector((state) => state.auth);
  console.log('user ', user);
  return (
    <div className="bg-white col-start-1 col-end-2 row-span-2  fixed h-screen w-60">
      <div className="p-4">
        <h1 className="text-center font-bold text-5xl">ÀIRNEIS</h1>
        <p className="text-center font-medium">Admin</p>
      </div>
      <div className="flex flex-col p-8 space-y-3">
        <NavLink
          to="/"
          className="transition-colors hover:bg-gray-100  p-2 rounded flex items-center"
        >
          <BiHomeAlt className="mr-2" />
          <span>Tableau de bord</span>
        </NavLink>
        <NavLink
          to="/category"
          className="transition-colors hover:bg-gray-100  p-2 rounded flex items-center"
        >
          <BiCategoryAlt className="mr-2" />
          <span>Categories</span>
        </NavLink>
        <NavLink
          to="/material"
          className="transition-colors hover:bg-gray-100  p-2 rounded flex items-center"
        >
          <BsTags className="mr-2" />
          <span>Materiaux</span>
        </NavLink>
        <NavLink
          to="/product"
          className="transition-colors hover:bg-gray-100  p-2 rounded flex items-center"
        >
          <BsCart3 className="mr-2" />
          <span>Produits</span>
        </NavLink>
        <NavLink
          to="/user-customer"
          className="transition-colors hover:bg-gray-100  p-2 rounded flex items-center"
        >
          <FiUsers className="mr-2" />
          <span>Clients</span>
        </NavLink>
        <NavLink
          to="/order"
          className="transition-colors  hover:bg-gray-100 p-2 rounded flex items-center"
        >
          <CiDeliveryTruck size={23} className="mr-2" />
          <span>Commandes</span>
        </NavLink>
        <NavLink
          to="/contact"
          className="transition-colors hover:bg-gray-100  p-2 rounded flex items-center"
        >
          <MdMailOutline className="mr-2" />
          <span>Contacts</span>
        </NavLink>
        {
          user.roles?.includes('superAdmin') && <NavLink
          to="/user-admin"
          className="transition-colors  hover:bg-gray-100 p-2 rounded flex items-center"
        >
          <CgScreen className="mr-2" />
          <span>Administrators</span>
        </NavLink>
        }
        
      </div>
    </div>
  );
}
