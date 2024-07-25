/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { SlQuestion } from "react-icons/sl";
import { MdOutlineDelete } from "react-icons/md";
import { Button, Input, Table, Image, Space, Tag, Popconfirm  } from "antd";
import CategoryFormComponent from "./components/CategoryFormComponent";
import { useDispatch, useSelector } from "react-redux";
import default_img from "@/assets/images/default_img.png";
import { deleteCategory, deleteManyCategories, fetchCategories } from "../../redux/slices/categories";
const { Search } = Input;
import { toast } from "sonner";
import parse from 'html-react-parser';

export default function CategoryPage() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [dataEdit, setDataEdit] = useState(null);
  const [categoryListDeleted, setCategoryListDeleted] = useState([]);
  const dispatch = useDispatch();
  const { categories, isLoading, message, error } = useSelector((state) => state.categories);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  //## region formattage des données
    const categoryList = categories?.map(c=>({
      key: c._id,
      id: c._id,
      name: c.name,
      color: c.color,
      image: c.image,
      description: c.description,
    })).sort((a,b) => a.name.localeCompare(b.name))
  //## endregion formattage des données avec une seule image

  //## gestion du filtre avec input de recherche
  const onInput = ({ target }) => {
    setSearchText(target.value);
  };
  //## endregion gestion du filtre avec input de recherche

  //## region gestion du filtre sur le tableau(asc/desc)
  const handleChange = (_, filters, sorter) => {
    setSortedInfo(sorter);
  };
  //## endregion gestion du filtre sur le tableau(asc/desc)

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => (
        String(record.name).toLowerCase().includes(value.toLowerCase()) 
      ),
      //## region gestion du filtre sur le tableau(asc/desc)
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      //## endregion gestion du filtre sur le tableau(asc/desc)
      render: (text) => <p className="font-medium">{text}</p>
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (text) => <Tag className="w-6 h-6" color={text}/>
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, data) => <div className=""><Image className="rounded" width={50} height={50} src={data?.image?.url ?? default_img} /></div>
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <p>{text.length > 60 ? parse(`${text.substring(0, 60)}...`) : parse(text)}</p>
    },
    
    {
      title: <h1 className="flex justify-end mr-12">Actions</h1>,
      dataIndex: "id",
      render: (_,data) => (
        <div className="flex justify-end mr-10"> 
          <Space size="middle">
            <FiEdit size={22} color="rgb(71 85 105)" className="cursor-pointer" onClick={()=>showDrawer(data)} /> 
            <MdOutlineDelete size={24} color="#ff6b6b" className="cursor-pointer" onClick={()=>dispatch(deleteCategory(data.id))} />
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

  //## region selection multiple tableau
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      console.log("selectedRowKeys ", selectedRowKeys);
      console.log("selectedRows ", selectedRows);
      setCategoryListDeleted(selectedRows.map(c => ({id:c.id, image:c.image})));
    }
  };
  console.log("categoryListDeleted ", categoryListDeleted);
  const submiData = async () => {
    try {
      await dispatch(deleteManyCategories({ categoryListDeleted }));
      toast.success(message);
      setSelectedRowKeys([]);
      setCategoryListDeleted([]);
    } catch (e) {
      toast.error(error);
    }
  };

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setCategoryListDeleted([]);
  };
  //##endregion selection multiple tableau

  useEffect(() => {
    dispatch(fetchCategories());
  },[]);

  return (
    <div className="mt-5">
      <CategoryFormComponent
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
          Ajouter une categorie
        </Button>
        <Popconfirm
          placement="right"
          title={`Suppression de ${categoryListDeleted.length} categorie${categoryListDeleted.length > 1 ? 's' : ''}`}
          description="êtes-vous sûr de continuer ?"
          icon={<SlQuestion className="mr-2" color="red"/>}
          onConfirm={()=>submiData()}
          onCancel={()=>resetSelectedRows([])}
        >
          {
          categoryListDeleted.length > 0 && 
          <Button
          type="primary" danger
          onClick={()=>{}}
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
          dataSource={categoryList}
        />
      </div>
    </div>
  );
}
