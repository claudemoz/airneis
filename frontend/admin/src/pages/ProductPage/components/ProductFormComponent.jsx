/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  InputNumber,
} from "antd";
import UploadFile from "@/components/UploadFile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct,updateProduct } from "../../../redux/slices/products";
import { fetchCategories } from "../../../redux/slices/categories";
import { fetchMaterials } from "../../../redux/slices/materials";

//##region Valeur de l'éditeur de text(input descripction du produit)
const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    // ["blockquote", "code-block"],
    ["link"],

    [{ align: [] }],
    // [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],

    // ["clean"], // remove formatting button
  ],
};
//##endregion Valeur de l'éditeur de text(input descripction du produit)

export default function ProductFormComponent({ openSidebar, onCloseDrawer, dataEdit }) {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [imgRemovedList, setImgRemovedList] = useState([]);
  const dispatch = useDispatch();
  const {  materials } = useSelector((state) => state.materials);
  const { categories } = useSelector((state) => state.categories);
  const categoriesList = categories.map(c =>({ value: c._id, label: c.name }));
  const materialsList = materials.map(m =>({ value: m._id, label: m.name }));

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchMaterials());
  },[])


  //###region  submit data
  const onFinish = (values) => {
    values.images = files;
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("materials", JSON.stringify(values.materials));
    formData.append("categories", JSON.stringify(values.categories));
    formData.append("price", Number(typeof values.price === 'string' && values.price.includes(',') ? values.price.replace(',', '.') : values.price));
    formData.append("stock", values.stock);
    formData.append("description", values.description ? values.description : "");
    for (const file of files) {
      if(!file?.originFileObj){
        setFiles([])
      }else{
        formData.append("images", file?.originFileObj, file.originFileObj?.name);
      }
    }
    if(dataEdit?.id){
      if(imgRemovedList.length > 0){
        formData.append("imgRemovedList", JSON.stringify(imgRemovedList));
      }
      dispatch(updateProduct({productId:dataEdit?.id, formData}));
      setFiles([]);
    }else{
      dispatch(addProduct(formData));
      setFiles([]);
    }
    onCloseDrawer();
    form.resetFields();
  };

  const onFinishFailed = (error) => {
    console.log({ error });
  };
  const onClose = () => {
    onCloseDrawer();
    form.resetFields();
  };
  //###endregion  submit data

  // ###region  edit product(initialisation des données de mise à jour) 
  useEffect(() => {
    if (dataEdit) {
      form.setFieldsValue({
        name: dataEdit.name,
        materials: dataEdit.materials?.map(m =>m.id),
        categories: dataEdit.categories?.map(c =>c.id),
        price: dataEdit.price,
        stock: dataEdit.stock,
        description: dataEdit.description,
      });
      setFiles(dataEdit.images?.map(item =>({
        uid: item._d,
        status: "done",
        id:item._id,
        index: item.index,
        path: item.path,
        url: item.url,
      })));
    }
  }, [dataEdit]);
  //##endregion  edit product(initialisation des données de mise à jour) 
  return (
    <>
      <Drawer
        title={dataEdit?.id ? 'Edition  produit' : 'Nouveau produit'}
        width={720}
        onClose={onClose}
        open={openSidebar}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form
          layout="vertical"
          labelCol={{ span: 10 }}
          onFinish={onFinish}
          form={form}
          autoComplete="off"
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Nom"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le nom du produit",
                  },
                ]}
              >
                <Input placeholder="Nom du produit..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="materials"
                label="Materiaux"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer la matière du produit",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Matière du produit..."
                  options={materialsList}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categories"
                label="Categories"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer la categorie produit",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Categorie du produit..."
                  options={categoriesList}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Prix (€)"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le prix du produit",
                  },
                ]}
              >
                <Input placeholder="Prix du produit..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Stock"
                rules={[
                  {
                    required: true,
                    type: "number",
                    message: "Veuillez entrer le stock du produit",
                    // min: 0,
                    // max: 99,
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="images"
                label="Images"
                rules={[
                  {
                    required: true,
                    validator: () => (files && files?.length > 0) ? Promise.resolve() : Promise.reject("Veuillez ajouter au moins une image du produit"),
                  },
                ]}
              >
                <UploadFile  
                  files={files} 
                  setFiles={setFiles}
                  maxFile={6}
                  imgRemovedList={imgRemovedList}
                  setImgRemovedList={setImgRemovedList}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: false,
                    message: "veuillez entrez la description du produit",
                  },
                ]}
              >
                <QuillEditor
                  placeholder="Description du produit..."
                  theme="snow"
                  modules={modules}
                />
                {/* <Input.TextArea
                  rows={4}
                  placeholder="Description du produit..."
                /> */}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="fixed bottom-0">
            <Space>
              <Button onClick={onClose} type="primary" danger>
                Annuler
              </Button>
              <Button
                htmlType="submit"
                type="primary"
              >
                Enregister
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
