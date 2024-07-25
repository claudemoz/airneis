import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { SlQuestion } from "react-icons/sl";
import { MdOutlineDelete } from "react-icons/md";
import { Button, Input, Table, Space, Popconfirm,Image } from "antd";
import dayjs from 'dayjs';
import UserFormComponent from "./components/UserFormComponent";
import {
  deleteManyUsers,
  deleteUser,
  fetchAdminUsers,
} from "../../redux/slices/users";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import default_img from "@/assets/images/default_img.png";

export default function AdminUserPage() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [dataEdit, setDataEdit] = useState(null);
  const [userListDeleted, setUserListDeleted] = useState([]);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const usersState = useSelector((state) => state.users);
  const {users, isLoading, message, error } = usersState || {};

  const userList = users?.map((p) => ({
    key: p._id,
    id: p._id,
    photo: p.photo, 
    firstname:p.firstname,
    lastname:p.lastname,
    email: p.email,
    roles: p.roles[0], 
    createdAt: dayjs(p.createdAt).format('DD/MM/YYYY'),
  })).sort((a,b) => a.firstname?.localeCompare(b.firstname));

  const onInput = ({ target }) => {
    setSearchText(target.value);
  };

  const handleChange = (_, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Firstname",
      dataIndex: "firstname",
      key: "firstname",
      filteredValue: [searchText],
      onFilter: (value, record) =>
        String(record.firstname)
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        String(record.email)
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        String(record.role)
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        String(record.createdAt)
          .toLowerCase()
          .includes(value.toLowerCase()),
      sorter: (a, b) => a.firstname.length - b.firstname.length,
      sortOrder:
        sortedInfo.columnKey === "Firstname" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text) => <p className="font-medium">{text}</p>,
    },
    {
      title: "Lastname",
      dataIndex: "lastname",
      key: "lastname",
      filteredValue: [searchText],
      onFilter: (value, record) =>
        String(record.lastname)
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        String(record.email)
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        String(record.role)
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        String(record.createdAt)
          .toLowerCase()
          .includes(value.toLowerCase()),
      sorter: (a, b) => a.lastname.length - b.lastname.length,
      sortOrder:
        sortedInfo.columnKey === "lastname" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text) => <p className="font-medium">{text}</p>,
    },
    {
      title: "photo",
      dataIndex: "photo",
      key: "photo",
      render: (_, data) => <div className=""><Image className="rounded" width={50} height={50} src={data?.photo?.url ?? default_img} /></div>
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <p className="font-medium">{text}</p>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (_, data) => <p className="font-medium">{data.roles}</p>,
    },
    {
      title: "Date d'ajout",
      dataIndex: "createdAt",
      render: (text) => <p className="font-medium">{text}</p>,
    },
    {
      title: <h1 className="flex justify-end mr-12">Actions</h1>,
      dataIndex: "id",
      render: (_, data) => (
        <div className="flex justify-end mr-10">
          <Space size="middle">
            <FiEdit
              size={22}
              color="rgb(71 85 105)"
              className="cursor-pointer"
              onClick={() => showDrawer(data)}
            />
            <MdOutlineDelete
              size={24}
              color="#ff6b6b"
              className="cursor-pointer"
              onClick={() => dispatch(deleteUser(data.id))}
            />
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
      setSelectedRowKeys(selectedRowKeys)
      setUserListDeleted(selectedRows.map(p => ({id:p.id, photo:p.photo})));
    },
  };

  const submitData = async () => {
    try {
      await dispatch(deleteManyUsers({ userListDeleted }));
      toast.success(message);
      setSelectedRowKeys([]);
      setUserListDeleted([]);
    } catch (e) {
      toast.error(error);
    }
  };

  const resetSelectedRows = () => {
    setUserListDeleted([]);
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, []);

  return (
    <div className="mt-5">
      <UserFormComponent
        openSidebar={openSidebar}
        showDrawer={() => showDrawer()}
        dataEdit={dataEdit}
        onCloseDrawer={onCloseDrawer} 
      />
      <div className="flex justify-between">
        <div>
          <Button type="primary" onClick={showDrawer}>
            Ajouter un utilisateur
          </Button>
          <Popconfirm
            placement="right"
            title={`Suppression de ${userListDeleted.length} utilisateur${
              userListDeleted.length > 1 ? "s" : ""
            }`}
            description="Êtes-vous sûr de continuer ?"
            icon={<SlQuestion className="mr-2" color="red" />}
            onConfirm={() => submitData()}
            onCancel={() => resetSelectedRows()}
          >
            {userListDeleted.length > 0 && (
              <Button type="primary" danger onClick={() => {}} className="ml-2">
                Supprimer
              </Button>
            )}
          </Popconfirm>
        </div>
        <Input.Search
          placeholder="Rechercher..."
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
          dataSource={userList}
        />
      </div>
    </div>
  );
}