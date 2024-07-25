import { useState, useEffect } from "react";
import { SlQuestion } from "react-icons/sl";
import { MdOutlineDelete } from "react-icons/md";
import { Button, Input, Table, Space, Tag, Popconfirm } from "antd";
import { AiOutlineFileSearch } from "react-icons/ai";
import OrderFormComponent from "./components/OrderFormComponent";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, deleteManyOrders, fetchOrders } from "../../redux/slices/orders";
import { toast } from "sonner";


const { Search } = Input;

export default function OrderPage() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [dataEdit, setDataEdit] = useState(null);
  const [orderListDeleted, setOrderListDeleted] = useState([]);
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const orderList = orders?.map(o => ({
    key: o._id,
    id: o._id,
    reference:o.reference,
    customer_fullname: `${o.customerId?.firstname} ${o.customerId?.lastname}`, 
    status: o.status,
    date: o.date,
    price: o.price,
    phone : o.phone,
    billing_address : o.billing_address,
    delivery_address : o.delivery_address,
    paymentMethod: o.payment_method,
    order_items : o.order_items,
    carrier : o.carrierId
  })).sort((a, b) => a.date.localeCompare(b.date));

  const onInput = ({ target }) => {
    setSearchText(target.value);
  };

  const handleChange = (_, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "N° de la commande",
      dataIndex: "reference",
      key: "reference",
      render: (text) => <p className="font-medium">{text}</p>
    },
    {
      title: "Client",
      dataIndex: "customer_fullname",
      key: "customer_fullname",
      filteredValue: [searchText],
      onFilter: (value, record) => (
        String(record.reference).toLowerCase().includes(value.toLowerCase()) ||
        String(record.customer_fullname).toLowerCase().includes(value.toLowerCase())
      ),
      sorter: (a, b) => a.customer.length - b.customer.length,
      sortOrder: sortedInfo.columnKey === "customer" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text) => <p className="font-medium">{text}</p>
    },
    {
      title: "Status de la commande",
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color={text === 'delivered' ? 'green' : 'blue'}>{text}</Tag>
    },
    
    {
      title: "Prix total",
      dataIndex: "price",
      key: "price",
      render: (text) => <p>{text.toFixed(2)} €</p>
    },
    {
      title: "Methode de paiement",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text) => <p>{text}</p>
    },
    {
      title: "Date de la commande",
      dataIndex: "date",
      key: "date",
      render: (text) => <p>{new Date(text).toLocaleDateString()}</p>
    },
    {
      title: <h1 className="flex justify-end mr-12">Actions</h1>,
      dataIndex: "id",
      render: (_, data) => (
        <div className="flex justify-end mr-10">
          <Space size="middle">
            <AiOutlineFileSearch  size={22} color="rgb(71 85 105)" className="cursor-pointer" onClick={() => showDrawer(data)} />
            <MdOutlineDelete size={24} color="#ff6b6b" className="cursor-pointer" onClick={() => handleDeleteOrder(data.id)} />
          </Space>
        </div>
      ),
    },
  ];

  const showDrawer = (data) => {
    setDataEdit(data);
    setOpenSidebar(true);
  };

  const onCloseDrawer = () => {
    setOpenSidebar(false);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setOrderListDeleted(selectedRows.map(o => ({ id: o.id })));
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await dispatch(deleteOrder(id));
      toast.success("Commande supprimée avec succès");
      dispatch(fetchOrders()); // Rafraîchir les données après suppression
    } catch (e) {
      toast.error(error);
    }
  };

  const submiData = async () => {
    try {
      await dispatch(deleteManyOrders({ orderListDeleted }));
      toast.success("Commandes supprimées avec succès");
      setSelectedRowKeys([]);
      setOrderListDeleted([]);
      dispatch(fetchOrders()); // Rafraîchir les données après suppression
    } catch (e) {
      toast.error(error);
    }
  };

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setOrderListDeleted([]);
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return (
    <div className="mt-5">
      <OrderFormComponent
        openSidebar={openSidebar}
        showDrawer={() => showDrawer()}
        dataEdit={dataEdit}
        onCloseDrawer={onCloseDrawer}
      />
      <div className="flex justify-between">
        <div>
          <Popconfirm
            placement="right"
            title={`Delete ${orderListDeleted.length} order${orderListDeleted.length > 1 ? 's' : ''}`}
            description="Are you sure you want to proceed?"
            icon={<SlQuestion className="mr-2" color="red" />}
            onConfirm={submiData}
            onCancel={resetSelectedRows}
          >
            {orderListDeleted.length > 0 &&
              <Button type="primary" danger className="ml-2">
                Delete
              </Button>
            }
          </Popconfirm>
        </div>
        <Search
          placeholder="Search..."
          onInput={onInput}
          onSearch={(value) => setSearchText(value)}
          style={{ width: 200 }}
        />
      </div>
      <div className="mt-5">
        <Table
          loading={isLoading}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          onChange={handleChange}
          dataSource={orderList}
        />
      </div>
    </div>
  );
}
