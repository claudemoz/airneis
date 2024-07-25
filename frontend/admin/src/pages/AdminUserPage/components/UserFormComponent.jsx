import { Button, Col, Form, Input, Row, Select,Drawer,Space,message,Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateUser } from "../../../redux/slices/users";
import { useEffect, useState } from "react";
import UploadFile from "@/components/UploadFile";

//celle là:
export default function UserFormComponent({
  openSidebar,
  onCloseDrawer,
  dataEdit,
  defaultRole,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
const [imgRemovedList, setImgRemovedList] = useState([]);



  const rolesList = [
    { value: defaultRole, label: defaultRole },
    { value: "admin", label: "Administrateur" },
    { value: "superAdmin", label: "superAdmin" },
  ];
  



  const onFinish = (values) => {
    console.log("files ", files);
    console.log("values ", values);
    values.photo = files;
    const formData = new FormData();
    formData.append("firstname", values.firstname);
    formData.append("lastname", values.lastname);
    formData.append("email", values.email);
    formData.append("roles", values.roles);
    formData.append("Verified", true);
    for (const file of files) {
      if (!file?.originFileObj) {
        setFiles([]);
      } else {
        formData.append("photo", file?.originFileObj, file.originFileObj?.name);
      }
    }
    if (dataEdit?.id) {
      if (imgRemovedList.length > 0) {
        formData.append("imgRemovedList", JSON.stringify(imgRemovedList));
      }
      dispatch(updateUser({ userId: dataEdit?.id, formData }));
      setFiles([]);
    } else {
      dispatch(addUser(formData));
      setFiles([]);
    }
    onCloseDrawer();
    form.resetFields();
  };
  
  useEffect(() => {
    if (dataEdit) {
      console.log("dataEdit ", dataEdit);
      form.setFieldsValue({
        firstname: dataEdit.firstname,
        lastname: dataEdit.lastname,
        photo: dataEdit.photo,
        email: dataEdit.email,
        roles: dataEdit.roles || defaultRole,
      });
      
      setFiles([{
        uid: dataEdit?.id,
        status: "done",
        id:dataEdit.id,
        path: dataEdit?.photo?.path,
        url: dataEdit?.photo?.url,
      }]);
    }
  }, [dataEdit, defaultRole]);
  const onFinishFailed = (error) => {
    console.log({ error });
  };

  const onClose = () => {
    onCloseDrawer(); 
    form.resetFields();
  };

  return (
    <>
      <Drawer
        title={dataEdit?.id ? "Edition utilisateur" : "Nouvel utilisateur"}
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
            <Col span={12}>
              <Form.Item
                name="firstname"
                label="Nom d'utilisateur"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le nom d'utilisateur",
                  },
                ]}
              >
                <Input placeholder="Nom d'utilisateur..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastname"
                label="Nom de famille"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le nom de famille",
                  },
                ]}
              >
                <Input placeholder="Nom de famille..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer l'email",
                  },
                ]}
              >
                <Input placeholder="Email..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="roles"
                label="Roles"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le role",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Role..."
                  options={rolesList}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
            <Form.Item
                name="photo"
                label="photo"
                rules={[
                  {
                    required: true,
                    validator: () => (files && files?.length > 0) ? Promise.resolve() : Promise.reject("Veuillez ajouter une image de user"),
                  },
                ]}
              >
                <UploadFile  
                  files={files} 
                  setFiles={setFiles}
                  maxFile={1}
                  imgRemovedList={imgRemovedList}
                  setImgRemovedList={setImgRemovedList}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="fixed bottom-0">
            <Space>
              <Button onClick={onClose} type="primary" danger>
                Annuler
              </Button>
              <Button htmlType="submit" type="primary">
                Enregister
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
