import { useState, useEffect } from "react";
import { Button, Input, Table, Popconfirm } from "antd";
import { SlQuestion } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchContacts,
  deleteManyContacts,
  deleteContact,
} from "../../redux/slices/contacts.js";
const { Search } = Input;

export default function ContactPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const [contactListDeleted, setContactListDeleted] = useState([]);
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.contacts);
  const [sortedInfo, setSortedInfo] = useState({});
  const contactList = contacts
    ?.map((c) => ({
      key: c._id,
      id: c._id,
      message: c.message,
      email: c.email,
      objet: c.objet,
    }))
    .sort((a, b) => a.email.localeCompare(b.email));

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleChange = (_, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const onInput = ({ target }) => {
    setSearchText(target.value);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setContactListDeleted(
        selectedRows.map((contact) => ({ id: contact.id }))
      );
      setSelectedRowKey(selectedRowKey[0]);
    },
  };
  // const rowSelection = {
  //   selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedRowKey(selectedRowKeys[0]);
  //   },
  // };

  const submitData = async () => {
    try {
      await dispatch(deleteManyContacts({ contactListDeleted }));
      await dispatch(deleteContact(selectedRowKey));
      setSelectedRowKeys([]);
      setContactListDeleted([]);
    } catch (e) {
      console.error("Erreur lors de la suppression des contacts :", e);
    }
  };
  // const submitData = async () => {
  //   try {
  //     if (selectedRowKey) {
  //       await dispatch(
  //         deleteContact(selectedRowKey),
  //         deleteManyContacts({ contactListDeleted })
  //       );
  //       setSelectedRowKey(null);
  //       setContactListDeleted([]);
  //     }
  //   } catch (e) {
  //     console.error("Erreur lors de la suppression du contact :", e);
  //   }
  // };

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setContactListDeleted([]);
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filteredValue: [searchText],
      onFilter: (value, record) =>
        String(record.email).toLowerCase().includes(value.toLowerCase()),

      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text) => <p className="font-medium">{text}</p>,
    },
    {
      title: "Objet",
      dataIndex: "objet",
    },

    {
      title: "Message",
      dataIndex: "message",
      render: (text) => <p className="font-medium">{text} </p>,
    },
  ];

  return (
    <div className="mt-5">
      <div className="flex justify-between">
        <div>
          <Popconfirm
            placement="right"
            title={`Suppression de ${selectedRowKeys.length} contacts`}
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
          dataSource={contactList}
        />
        {/* <Table
          loading={isLoading}
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          columns={columns}
          onChange={handleChange}
          dataSource={contacts}
        /> */}
      </div>
    </div>
  );
}
