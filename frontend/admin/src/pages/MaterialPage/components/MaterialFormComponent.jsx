/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Button, Col, Drawer, Form, Input, Row, Space, ColorPicker } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMaterial, updateMaterial } from "../../../redux/slices/materials";

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


export default function MaterialFormComponent({ openSidebar, onCloseDrawer, dataEdit }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();


  const onFinish = (values) => {
    values.color = /^#[0-9A-F]{6}$/i.test(values.color) ? values.color : values.color.toHexString();


    if (dataEdit?.id) {
      dispatch(updateMaterial({materialId:dataEdit?.id, values}));
    } else {
      dispatch(addMaterial(values));
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

  useEffect(() => {
    if (dataEdit?.id) {
      form.setFieldsValue({
        name: dataEdit.name,
        description: dataEdit.description,
      });
    }
  }, [dataEdit]);

  return (
    <Drawer
      title={dataEdit?.id ? 'Edition matériel' : 'Nouveau matériel'}
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
                  message: "Veuillez entrer le nom du matériel",
                },
              ]}
            >
              <Input placeholder="Nom du matériel..." />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="color"
                label="Couleur"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer la couleur liée au matériel ",
                  },
                ]}
              >
               <ColorPicker defaultValue="#6c5ce7"/>
              </Form.Item>
            </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: false,
                  message: "Veuillez entrer la description du matériel",
                },
              ]}
            >
             <QuillEditor
                  placeholder="Description du matériel..."
                  theme="snow"
                  modules={modules}
                />
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
              Enregistrer
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
