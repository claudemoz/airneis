import { Card } from "antd";
("react-icons/io");
import { FiUsers } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { CgTimelapse } from "react-icons/cg";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { Tabs } from "antd";
import dayjs from 'dayjs';
import { useSelector } from "react-redux";

const onChange = (key) => {
  console.log(key);
};
export default function DashboardPage() {
  const items = [
    {
      key: "1",
      label: "Nouvelles",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "Preparations",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Expédiées",
      children: "Content of Tab Pane 3",
    },
  ];
  const { user  } = useSelector((state) => state.auth);
  console.log("dayjs.locale() ", dayjs.locale('fr'));
  return (
    <div className="flex flex-col">
      <div className="flex space-x-2">
        <Card bordered={false} style={{ width: 600 }} className="1/3 p-10">
          <h1 className="text-2xl text-center font-medium">Bonjour, {`${user.firstname}`} </h1>
          <h3 className="text-xl text-center font-medium">
            Nous sommes le {dayjs(Date.now()).locale('fr').format('D MMMM YYYY')}
          </h3>
        </Card>
        <Card
          title="Statistiques"
          bordered={false}
          style={{ width: "100%" }}
          className="2/3 flex flex-col justify-between"
        >
          <div className="flex justify-between">
            <div className="flex space-x-3 items-center">
              <CgTimelapse size={40} color="#a29bfe" />
              <div className="flex flex-col">
                <h1 className="text-2xl">8.549k</h1>
                <h2>Ventes</h2>
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              <BsCart3 size={40} color="#74b9ff" />
              <div className="flex flex-col">
                <h1 className="text-2xl">8.549k</h1>
                <h2>Produits</h2>
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              <FiUsers size={40} color="#ff7675" />
              <div className="flex flex-col">
                <h1 className="text-2xl">8.549k</h1>
                <h2>Clients</h2>
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              <RiMoneyEuroCircleLine size={40} color="#55efc4" />
              <div className="flex flex-col">
                <h1 className="text-2xl">8.549k</h1>
                <h2>Recettes</h2>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex space-x-2 mt-2">
        <Card
          title="Produits populaires"
          bordered={false}
          style={{ width: "100%", height: 485 }}
          className="1/2 "
        >
          xxx
        </Card>
        <Card
          title="Commandes"
          bordered={false}
          style={{ width: "100%" }}
          className="1/2"
        >
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            size="large"
            centered={true}
          />
          ;
        </Card>
      </div>
    </div>
  );
}
