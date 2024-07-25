/* eslint-disable react/prop-types */
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export default function UploadFile({ files, setFiles, maxFile,imgRemovedList, setImgRemovedList}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  //   [
  //   {
  //     uid: "-1",
  //     name: "image.png",
  //     status: "done",
  //     url: "https://m.media-amazon.com/images/I/71KRnCQH3YL._AC_SX679_.jpg",
  //   },
  //   {
  //     uid: "-2",
  //     name: "image.png",
  //     status: "done",
  //     url: "https://m.media-amazon.com/images/I/81RMmpdcemL._AC_SX679_.jpg",
  //   },
  //   {
  //     uid: "-3",
  //     name: "image.png",
  //     status: "done",
  //     url: "https://m.media-amazon.com/images/I/71it2iDksyL._AC_SX679_.jpg",
  //   },
  //   {
  //     uid: "-4",
  //     name: "image.png",
  //     status: "done",
  //     url: "https://m.media-amazon.com/images/I/81lKUbqC0CL._AC_SX679_.jpg",
  //   },
  // ]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setFiles(newFileList);
  };

  const handleRemove = (img) =>{
    setImgRemovedList([...imgRemovedList,{
      index: img.index,
      id:img.id,
      path: img.path,
      url: img.url,
    }])
  }
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <>
      <Upload
        action="http://localhost:9000/api/v1/upload/init-upload-status"
        listType="picture-card"
        fileList={files ?? fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        accept="image/png, image/jpeg"
        maxCount={maxFile}
        onRemove={handleRemove}
      >
        {(fileList?.length >= maxFile || files?.length >= maxFile) ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}
