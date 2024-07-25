/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { SlQuestion } from "react-icons/sl";
import { MdOutlineDelete } from "react-icons/md";
import { LuExternalLink } from "react-icons/lu";
import { Button, Input, Table, Image, Space, Tag, Popconfirm, Tooltip  } from "antd";
import ProductFormComponent from "./components/ProductFormComponent";
import { deleteManyProducts, deleteProduct, fetchProducts } from "../../redux/slices/products";
import { useDispatch, useSelector } from "react-redux";
import default_img from "@/assets/images/default_img.png";
import { fetchCategories } from "../../redux/slices/categories";
import { fetchMaterials } from "../../redux/slices/materials";
const { Search } = Input;
import { toast } from "sonner";

export default function ProductPage() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [dataEdit, setDataEdit] = useState(null);
  const [productListDeleted, setProductListDeleted] = useState([]);
  const dispatch = useDispatch();
  const { products, isLoading, message, error } = useSelector((state) => state.products);
  const {  materials } = useSelector((state) => state.materials);
  const { categories } = useSelector((state) => state.categories);
  const categoriesList = categories.map(c =>({ id: c._id, name: c.name, color:c.color }));
  const materialsList = materials.map(m =>({ id: m._id, name: m.name, color:m.color }));
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  //## region formattage des données avec une seule image
  const productList = products?.map((p) => ({
    key: p._id,
    id: p._id,
    name: p.name,
    images: p.images,
    image: p.images?.[0],
    price: p.price,
    stock: p.stock,
    materials: materialsList.filter(c => p.materials.includes(c.id)),
    categories: categoriesList.filter(c => p.categories.includes(c.id)),
    sales: p.sales,
    description: p.description,
  })).sort((a,b) => a.name.localeCompare(b.name));
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
        String(record.name).toLowerCase().includes(value.toLowerCase())  ||
        String(record.price).toLowerCase().includes(value.toLowerCase()) ||
        String(record.stock).toLowerCase().includes(value.toLowerCase()) ||
        String(record.sales).toLowerCase().includes(value.toLowerCase()) ||
        record.materials.some(m => String(m.name).toLowerCase().includes(value.toLowerCase())) ||
        record.categories.some(c => String(c.name).toLowerCase().includes(value.toLowerCase())) 
      ),
      //## region gestion du filtre sur le tableau(asc/desc)
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      //## endregion gestion du filtre sur le tableau(asc/desc)
      render: (text) => <p className="font-medium">{text}</p>
    },
    {
      title: "Materiaux",
      dataIndex: "materials",
      render: (_, { materials }) => (
        <>
          {materials.map((material) => {
            return (
              <Tag color={material.color} key={material.id}>
                {material.name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (_, { images }) => images.map((image) => <Image className="rounded" width={20} height={20} src={image?.url ?? default_img} />)
    },
    {
      title: "Prix",
      dataIndex: "price",
      render: (text) => <p className="font-medium">{text} €</p>,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      render: (_, { categories }) => (
        <>
          {categories.map((category) => {
            return (
              <Tag color={`${category.color}`} key={category.id}>
                {category.name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render: (text) => <p className="font-medium">{text}</p>
    },
    {
      title: "Ventes",
      dataIndex: "sales",
      render: (text) => <p className="font-medium">{text}</p>
    },
    {
      title: <h1 className="flex justify-end mr-12">Actions</h1>,
      dataIndex: "id",
      render: (_,data) => (
        <div className="flex justify-end mr-10">
          <Space size="middle">
          <Tooltip  color="rgb(71 85 105)" placement="bottom" title="Editer" >
            <FiEdit size={20} color="rgb(71 85 105)" className="cursor-pointer" onClick={()=>showDrawer(data)} /> 
          </Tooltip>
          <Tooltip color="rgb(71 85 105)" placement="bottom" title="details">
            <LuExternalLink size={22} color="rgb(71 85 105)" className="cursor-pointer" onClick={()=>{}} /> 
          </Tooltip>
          <Tooltip color="rgb(71 85 105)" placement="bottom" title="supprimer">
          <MdOutlineDelete size={22}  color="rgb(71 85 105)" className="cursor-pointer" onClick={()=>dispatch(deleteProduct(data.id))} />
          </Tooltip>
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
      setProductListDeleted(selectedRows.map(p => ({id:p.id, images:p.images})));
    }
  };
  const submiData = async () => {
    try {
      await dispatch(deleteManyProducts({ productListDeleted }));
      toast.success(message);
      setSelectedRowKeys([]);
      setProductListDeleted([]);
    } catch (e) {
      toast.error(error);
    }
  };

  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setProductListDeleted([]);
  };
  //##endregion selection multiple tableau

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchMaterials());
  }, []);


  return (
    <div className="mt-5">
      <ProductFormComponent
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
          Ajouter un produit
        </Button>
        <Popconfirm
          placement="right"
          title={`Suppression de ${productListDeleted.length} produit${productListDeleted.length > 1 ? 's' : ''}`}
          description="êtes-vous sûr de continuer ?"
          icon={<SlQuestion className="mr-2" color="red"/>}
          onConfirm={()=>submiData()}
          onCancel={()=>resetSelectedRows([])}
        >
          {
          productListDeleted.length > 0 && 
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
          dataSource={productList}
        />
      </div>
    </div>
  );
}
