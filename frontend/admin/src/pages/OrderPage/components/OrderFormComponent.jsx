/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
import "react-quill/dist/quill.snow.css";
import styles from './OrderFormPage.module.css'
import {
  Button,
  Row,
  Col,
  Drawer,
  Form,
  Space,
  Descriptions,
  Typography,
  Divider,
  Select,
} from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchOrders, updateOrder } from "../../../redux/slices/orders";

export default function Order({ openSidebar, onCloseDrawer, dataEdit }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [orderStatus, setOrderStatus] = useState(null);

  const onClose = () => {
    onCloseDrawer();
    form.resetFields();
  };

  const handleChange = (value) => {
    setOrderStatus(value);
  };
  const submitData = (e) => {
    e.stopPropagation();
    if (dataEdit?.id) {
      dispatch(updateOrder({orderId:dataEdit.id,status:orderStatus}))
      .then(() => dispatch(fetchOrders()));
      onCloseDrawer();
    }
  };

  // useEffect(() => {
  //   if (dataEdit?.id) {
  //     form.setFieldsValue({
  //       status: dataEdit?.status,
  //     });
  //   }
  // }, [dataEdit?.id]);

  return (
    <Drawer
      title={dataEdit?.id ? 'Detail de la commande' : ''}
      width={720}
      onClose={onClose}
      visible={openSidebar}
      bodyStyle={{ paddingBottom: 80 }}
    >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Price">
            <Typography.Text>{dataEdit?.price ? `${dataEdit.price}` : 'Prix non disponible'}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Customer ID">
            <Typography.Text>{dataEdit?.customer ? `${dataEdit.customer}` : 'Non disponible'}</Typography.Text>
          </Descriptions.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner le statut de la commande",
              },
            ]}
          >
            <Row gutter={8}>
              <Col span={12}>
                <Select
                  defaultValue={dataEdit?.status}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  placeholder="Status de commande..."
                  options={[
                    { value: 'pending', label: 'En attente' },
                    { value: 'processing', label: 'En cours de traitement' },
                    { value: 'shipped', label: 'Expédiée' },
                    { value: 'delivered', label: 'Livrée' },
                  ]}
                />
              </Col>
              <Col span={12}>
                <Button htmlType="submit" onClick={submitData} type="primary" style={{ marginLeft: 8 }}>
                  Enregistrer
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Descriptions.Item label="Date" className={styles.head_table}>
            <Typography.Text>{dataEdit?.date ? new Date(dataEdit.date).toLocaleDateString() : 'Non disponible'}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Billing Address">
            <Typography.Text>{dataEdit?.billing_address ? `${dataEdit.billing_address}` : 'Non disponible'}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Delivery Address">
            <Typography.Text>{dataEdit?.delivery_address ? `${dataEdit.delivery_address}` : 'Non disponible'}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            <Typography.Text>{dataEdit?.paymentMethod ? `${dataEdit.paymentMethod}` : 'Non disponible'}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Order Items">
            <Typography.Text>{dataEdit?.order_items ? `${dataEdit.order_items}` : 'Non disponible'}</Typography.Text>
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Form.Item className="fixed bottom-0">
          <Space>
            <Button onClick={onClose} type="primary" danger>
              Fermer
            </Button>
          </Space>
        </Form.Item>
    </Drawer>
  );
}
