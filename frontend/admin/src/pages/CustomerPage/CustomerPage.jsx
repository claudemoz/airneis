import { useState, useEffect } from "react";
import { Button, Input, Table, Popconfirm } from "antd";
import { SlQuestion } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteManyUsers,
  deleteUser,
  fetchCustomers,
} from "../../redux/slices/users";
const { Search } = Input;
export default function UserPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [userListDeleted, setUserListDeleted] = useState([]);
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const [sortedInfo, setSortedInfo] = useState({});
  const userList = users
    ?.map((c) => ({
      key: c._id,
      id: c._id,
      firstname: c.firstname,
      lastname: c.lastname,
      email: c.email,
    }))
    ?.sort((a, b) => a.lastname?.localeCompare(b?.lastname));
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // const handleChange = (_, filters, sorter) => {
  //   setSortedInfo(sorter);
  // };

  const onInput = ({ target }) => {
    setSearchText(target.value);
  };
  const handleChange = (_, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setUserListDeleted(selectedRows.map((user) => ({ id: user.id })));
      setSelectedRowKey(selectedRowKeys[0]);
    },
  };
  const submitData = async () => {
    try {
      await dispatch(deleteManyUsers({ userListDeleted }));
      await dispatch(deleteUser(selectedRowKey));
      setSelectedRowKeys([]);
      //setSelectedRowKey(null);
      setUserListDeleted([]);
    } catch (e) {
      console.error("Erreur lors de la suppression de l'utilisateur :", e);
    }
  };
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    //setSelectedRowKey(null);
    setUserListDeleted([]);
  };
  const columns = [
    {
      title: "Firstname",
      dataIndex: "firstname",
      key: "firstname",
      filteredValue: [searchText],
      onFilter: (value, record) =>
        String(record.firstname).toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Lastname",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text) => <p className="font-medium">{text}</p>,
    },
  ];
  return (
    <div className="mt-5">
      <div className="flex justify-between">
        <div>
          <Popconfirm
            placement="right"
            title={`Suppression de ${selectedRowKeys.length} utilisateurs`}
            description="Êtes-vous sûr de continuer ?"
            icon={<SlQuestion className="mr-2" color="red" />}
            onConfirm={submitData}
            onCancel={resetSelectedRows}
          >
            {selectedRowKeys.length > 0 && (
              <Button type="primary" danger className="ml-2">
                Supprimer
              </Button>
            )}
          </Popconfirm>
        </div>
        <Search
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
