// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import MessageItem from "../../../../../frontend/src/pages/ContactPage/ContactPage";

// // const ContactForm = () => {
// //   const [messages, setMessages] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       try {
// //         const response = await axios.get("/api/messages"); // Endpoint to fetch messages from backend
// //         setMessages(response.data);
// //         setIsLoading(false);
// //       } catch (error) {
// //         setError(error.message);
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchMessages();
// //   }, []);

// //   if (isLoading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (error) {
// //     return <div>Error: {error}</div>;
// //   }

// //   return (
// //     <div>
// //       <h1>Messages reçus depuis la page de contact</h1>
// //       {messages.length === 0 ? (
// //         <div>Aucun message n a été reçu.</div>
// //       ) : (
// //         <ul>
// //           {messages.map((message) => (
// //             <MessageItem key={message.id} message={message} />
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default ContactForm;
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/jsx-no-duplicate-props */
// /* eslint-disable react/prop-types */
// import QuillEditor from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import {
//   Button,
//   Col,
//   Drawer,
//   Form,
//   Input,
//   Row,
//   Space,
//   ColorPicker,
// } from "antd";
// import UploadFile from "@/components/UploadFile";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { addCategory, updateCategory } from "../../../redux/slices/categories";

// //##region Valeur de l'éditeur de text(input descripction du produit)
// const modules = {
//   toolbar: [
//     ["bold", "italic", "underline", "strike"], // toggled buttons
//     // ["blockquote", "code-block"],
//     ["link"],

//     [{ align: [] }],
//     // [{ header: 1 }, { header: 2 }], // custom button values
//     [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
//     [{ script: "sub" }, { script: "super" }], // superscript/subscript
//     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
//     [{ direction: "rtl" }], // text direction

//     // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
//     [{ header: [1, 2, 3, 4, 5, 6, false] }],

//     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//     [{ font: [] }],

//     // ["clean"], // remove formatting button
//   ],
// };
// //##endregion Valeur de l'éditeur de text(input descripction du produit)

// export default function CategoryFormComponent({
//   openSidebar,
//   onCloseDrawer,
//   dataEdit,
// }) {
//   const [form] = Form.useForm();
//   const [files, setFiles] = useState([]);
//   const [imgRemovedList, setImgRemovedList] = useState([]);
//   const dispatch = useDispatch();

//   //###region  submit data
//   const onFinish = (values) => {
//     values.images = files;
//     values.color = /^#[0-9A-F]{6}$/i.test(values.color)
//       ? values.color
//       : values.color.toHexString();
//     const formData = new FormData();
//     formData.append("name", values.name);
//     formData.append("color", values.color);
//     formData.append(
//       "description",
//       values.description ? values.description : ""
//     );
//     for (const file of files) {
//       if (!file?.originFileObj) {
//         setFiles([]);
//       } else {
//         formData.append("image", file?.originFileObj, file.originFileObj?.name);
//       }
//     }
//     if (dataEdit?.id) {
//       if (imgRemovedList.length > 0) {
//         formData.append("imgRemovedList", JSON.stringify(imgRemovedList));
//       }
//       dispatch(updateCategory({ categoryId: dataEdit?.id, formData }));
//       setFiles([]);
//     } else {
//       dispatch(addCategory(formData));
//       setFiles([]);
//     }
//     onCloseDrawer();
//     form.resetFields();
//   };

//   const onFinishFailed = (error) => {
//     console.log({ error });
//   };
//   const onClose = () => {
//     onCloseDrawer();
//     form.resetFields();
//   };
//   //###endregion  submit data
//   // ###region  edit product(initialisation des données de mise à jour)
//   useEffect(() => {
//     if (dataEdit?.id) {
//       form.setFieldsValue({
//         name: dataEdit.name,
//         color: dataEdit.color,
//         description: dataEdit.description,
//       });
//       setFiles([
//         {
//           uid: dataEdit?.id,
//           status: "done",
//           id: dataEdit.id,
//           path: dataEdit?.image?.path,
//           url: dataEdit?.image?.url,
//         },
//       ]);
//     }
//   }, [dataEdit]);
//   //##endregion  edit product(initialisation des données de mise à jour)
//   return (
//     <>
//       <Drawer
//         title={dataEdit?.id ? "Edition  categorie" : "Nouvelle categorie"}
//         width={720}
//         onClose={onClose}
//         open={openSidebar}
//         styles={{
//           body: {
//             paddingBottom: 80,
//           },
//         }}
//       >
//         <Form
//           layout="vertical"
//           labelCol={{ span: 10 }}
//           onFinish={onFinish}
//           form={form}
//           autoComplete="off"
//           onFinishFailed={onFinishFailed}
//         >
//           <Row gutter={16}>
//             <Col span={24}>
//               <Form.Item
//                 name="name"
//                 label="Nom"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Veuillez entrer le nom de la categorie",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Nom de la categorie..." />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="image"
//                 label="Image"
//                 rules={[
//                   {
//                     required: true,
//                     validator: () =>
//                       files && files?.length > 0
//                         ? Promise.resolve()
//                         : Promise.reject(
//                             "Veuillez ajouter une image de la categorie"
//                           ),
//                   },
//                 ]}
//               >
//                 <UploadFile
//                   files={files}
//                   setFiles={setFiles}
//                   maxFile={1}
//                   imgRemovedList={imgRemovedList}
//                   setImgRemovedList={setImgRemovedList}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="color"
//                 label="Couleur"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Veuillez entrer la couleur liée à la categorie",
//                   },
//                 ]}
//               >
//                 <ColorPicker defaultValue="#6c5ce7" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={24}>
//               <Form.Item
//                 name="description"
//                 label="Description"
//                 rules={[
//                   {
//                     required: false,
//                     message: "veuillez entrez la description du categorie",
//                   },
//                 ]}
//               >
//                 <QuillEditor
//                   placeholder="Description de la categorie..."
//                   theme="snow"
//                   modules={modules}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Form.Item className="fixed bottom-0">
//             <Space>
//               <Button onClick={onClose} type="primary" danger>
//                 Annuler
//               </Button>
//               <Button htmlType="submit" type="primary">
//                 Enregistrer
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Drawer>
//     </>
//   );
// }
