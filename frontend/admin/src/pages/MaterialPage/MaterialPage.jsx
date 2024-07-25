/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { SlQuestion } from "react-icons/sl";
import { MdOutlineDelete } from "react-icons/md";
import { Button, Input, Table, Space, Popconfirm, Tag } from "antd";
import MaterialFormComponent from "./components/MaterialFormComponent";
import { useDispatch, useSelector } from "react-redux";
import { deleteMaterial, deleteManyMaterials, fetchMaterials } from "../../redux/slices/materials";
const { Search } = Input;
import { toast } from "sonner";
import parse from 'html-react-parser';

export default function MaterialPage() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [dataEdit, setDataEdit] = useState(null);
  const [materialListDeleted, setMaterialListDeleted] = useState([]);
  const dispatch = useDispatch();
  const { materials, isLoading, message, error } = useSelector((state) => state.materials);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const materialList = materials?.map(m => ({
    key: m._id,
    id: m._id,
    name: m.name,
    description: m.description,
    color : m.color
  })).sort((a, b) => a.name.localeCompare(b.name));

  const onInput = ({ target }) => {
    setSearchText(target.value);
  };

  const handleChange = (_, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => (
        String(record.name).toLowerCase().includes(value.toLowerCase()) 
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text) => <p className="font-medium">{text}</p>
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <p>{parse(text)}</p>
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (text) => <Tag className="w-6 h-6" color={text}/>
    },
    {
      title: <h1 className="flex justify-end mr-12">Actions</h1>,
      dataIndex: "id",
      render: (_, data) => (
        <div className="flex justify-end mr-10"> 
          <Space size="middle">
            <FiEdit size={22} color="rgb(71 85 105)" className="cursor-pointer" onClick={() => showDrawer(data)} /> 
            <MdOutlineDelete size={24} color="#ff6b6b" className="cursor-pointer" onClick={() => handleDeleteMaterial(data.id)} />
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
      setMaterialListDeleted(selectedRows.map(m => ({ id: m.id })));
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      await dispatch(deleteMaterial(id));
      toast.success("Matériel supprimé avec succès");
      dispatch(fetchMaterials()); // Rafraîchir les données après suppression
    } catch (e) {
      toast.error(error);
    }
  };

  const submitData = async () => {
    try {
      await dispatch(deleteManyMaterials({ materialListDeleted }));
      toast.success("Matériaux supprimés avec succès");
      setSelectedRowKeys([]);
      setMaterialListDeleted([]);
      dispatch(fetchMaterials()); // Rafraîchir les données après suppression
    } catch (e) {
      toast.error(error);
    }
  };

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setMaterialListDeleted([]);
  };

  useEffect(() => {
    dispatch(fetchMaterials());
  }, []);

  return (
    <div className="mt-5">
      <MaterialFormComponent
        openSidebar={openSidebar}
        showDrawer={() => showDrawer()}
        dataEdit={dataEdit}
        onCloseDrawer={() => onCloseDrawer()}
      />
      <div className="flex justify-between">
        <div>
          <Button
            type="primary"
            onClick={showDrawer}
          >
            Ajouter un Matériel
          </Button>
          <Popconfirm
            placement="right"
            title={`Suppression de ${materialListDeleted.length} matériel${materialListDeleted.length > 1 ? 's' : ''}`}
            description="êtes-vous sûr de continuer ?"
            icon={<SlQuestion className="mr-2" color="red" />}
            onConfirm={() => submitData()}
            onCancel={() => resetSelectedRows([])}
          >
            {materialListDeleted.length > 0 && 
              <Button
                type="primary" danger
                onClick={() => {}}
                className="ml-2"
              >
                Supprimer
              </Button>
            }
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
          dataSource={materialList}
        />
      </div>
    </div>
  );
}
