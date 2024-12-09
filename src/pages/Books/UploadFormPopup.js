import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Upload,
  Typography,
  Spin,
  message,
  Progress,
} from "antd";
import { FaFileUpload } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { themeState } from "../../atom";
import ApiService from "../../APIServices/ApiService";
import * as XLSX from "xlsx";
import JSZip from "jszip";

const UploadFormPopup = ({ visible, setVisible, fetchAllBooks }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [theme] = useRecoilState(themeState);
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [progress, setProgress] = useState(0); // For tracking progress
  const [totalRows, setTotalRows] = useState(0); // Total rows in the Excel sheet
  const [currentRow, setCurrentRow] = useState(0); // Current row being processed
  const [text, setText] = useState("");

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setExcelFile(null);
    setZipFile(null);
    setProgress(0); // Reset progress when modal is closed
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.fileList[0]?.originFileObj || null);
  };

  const handleZipChange = (e) => {
    setZipFile(e.fileList[0]?.originFileObj || null);
  };

  const handleUpload = async () => {
    if (!excelFile || !zipFile) {
      message.error("Please upload both Excel and Zip files.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Extract Images from Zip File
      const zip = new JSZip();
      const zipData = await zip.loadAsync(zipFile);

      const extractedFiles = {};
      await Promise.all(
        Object.keys(zipData.files).map(async (filename) => {
          if (!zipData.files[filename].dir) {
            const fileData = await zipData.files[filename].async("blob");
            extractedFiles[filename] = new File([fileData], filename);
          }
        })
      );

      console.log(extractedFiles)
      

      // Step 2: Read and Parse the Excel File
      const reader = new FileReader();
      reader.onload = async () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setTotalRows(rows.length - 1); // Set total rows (excluding header)

        // Step 3: Process Each Row in Excel
        for (let i = 1; i < rows.length; i++) {
          setText("Creating Guide");
          setCurrentRow(i); // Update current row number

          const row = rows[i];
          const bookData = new FormData();
          bookData.append("name", row[0]);
          bookData.append("address", `${row[2]}, ${row[3]}`);
          bookData.append("city", row[2]);
          bookData.append("country", row[3]);
          bookData.append("description", row[1]);
          bookData.append("category_name", row[4]);
          bookData.append("price", row[6]);

          // Step 4: Match Image Path with Extracted File
          let imagePath = row[5]; // Assuming column 6 contains the image path
          imagePath = imagePath.replace("\\", "/");
          console.log(imagePath)
          if (imagePath && extractedFiles[imagePath]) {
            bookData.append("image", extractedFiles[imagePath]);
          } else {
            console.warn(`Image not found for path: ${imagePath}`);
          }

          // Step 5: Create Book via API
          try {
            const createBookResponse = await ApiService.createBook(bookData);
            if(createBookResponse && createBookResponse._id){

                // Step 6: Upload PDFs for the Book
                const files = JSON.parse(row[7]); // Assuming column 8 contains a JSON array of PDF files
                for (const fileObj of files) {
                    if (fileObj.file) {
                        setText("Uploading Guide PDFs");
                        let filePath = fileObj.file;
                        if (filePath && extractedFiles[filePath]) {
                        const formData1 = new FormData();
                        formData1.append("language", fileObj.language);
                        filePath = filePath.replace("\\", "/");
                        formData1.append("file", extractedFiles[filePath]);

                        await ApiService.uploadBookPDF(
                            createBookResponse._id,
                            formData1
                        );
                        }
                    }
                }
            }
          } catch (error) {
            console.error("Error creating book or uploading files:", error);
          }

          setProgress(Math.round(((i + 1) / rows.length) * 100)); // Update progress
        }

        message.success("All books and files uploaded successfully.");
        fetchAllBooks(); // Refresh the book list
        handleCancel(); // Close modal and reset state
        setLoading(false)
      };
      reader.readAsBinaryString(excelFile);
    } catch (error) {
      console.error("Error processing files:", error);
      message.error("Failed to upload books and files.");
      setLoading(false)
    }
  };

  return (
    <Modal
      open={visible}
      width={450}
      closable={false}
      title={
        <Typography.Title level={3} className="fw-500">
          Upload Guides
        </Typography.Title>
      }
      onOk={handleUpload}
      okText={"Upload"}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" name="upload_form">
        <Form.Item
          name="excel"
          label="Choose Excel file"
          rules={[{ required: true, message: "Please select an Excel file!" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload
            className={
              theme === "light" ? "upload-input-light" : "upload-input-dark"
            }
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            onChange={handleExcelChange}
          >
            <Button icon={<FaFileUpload />}>Browse Excel</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="zip"
          label="Choose Zip file"
          rules={[{ required: true, message: "Please select a Zip file!" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload
            className={
              theme === "light" ? "upload-input-light" : "upload-input-dark"
            }
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            onChange={handleZipChange}
          >
            <Button icon={<FaFileUpload />}>Browse Zip</Button>
          </Upload>
        </Form.Item>
      </Form>

      {loading && (
        <div style={{ marginTop: 20 }}>
          <Spin size="large" />
          <h3>{text}</h3>
          <Progress
            percent={progress}
            status="active"
            style={{ marginTop: 10, width: '350px'}}
            format={() => `${currentRow}/${totalRows} uploading`}
          />
        </div>
      )}
    </Modal>
  );
};

export default UploadFormPopup;
