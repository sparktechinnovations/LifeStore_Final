/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import { Alert, Button, Card, CircularProgress, Snackbar } from '@mui/material';
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux';
import { addManyPRoducts } from '../features/productSlice';

function ImportPage(props) {
  const [importedFile, setImportedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');
  const [importComplete, setImportComplete] = useState(false);

  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleCancelImport = () => {
    setImportedFile(null);
    setIsLoading(false);
    setImportComplete(false);

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleStartImport = () => {
    if (importedFile !== null) {
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headings = jsonData[0];
        const dataArray = jsonData.slice(1);

        let jsonDataObjects = dataArray.map((row) => {
          const obj = {};
          for (let i = 0; i < headings.length; i++) {
            obj[headings[i]] = row[i];
          }
          return obj;
        });
        jsonDataObjects = jsonDataObjects.filter((ele) => {
          if (!ele.productId) return false;

          return true;
        });

        dispatch(addManyPRoducts({ array: jsonDataObjects }))
          .then((result) => {
            if (result.meta.requestStatus === 'rejected') {
              handleShowNotification(result.payload.message || 'network error', 'error');
              return;
            }

            setIsLoading(false);
            setImportedFile(null);
            setImportComplete(true);

            handleShowNotification(
              `${result.payload.modifiedCount} products were modified, ${result.payload.upsertedCount} products were added`,
              'success'
            );
          })
          .catch((error) => {
            setIsLoading(false);
            setImportedFile(null);
            handleShowNotification('Error occurred Fetching Customer', 'error');
          });
      };

      reader.readAsBinaryString(importedFile);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    // console.log(file)
    setImportedFile(file);
  };

  const handleDownloadTemplate = () => {
    const fileUrl = 'https://life-store-storage.s3.ap-south-1.amazonaws.com/spreadsheet.xlsx';

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'empty_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={() => setNotificationOpen(false)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        {importComplete && (
          <Alert variant="filled" onClose={() => setNotificationOpen(false)} severity={notificationSeverity}>
            {notificationMessage}
          </Alert>
        )}
      </Snackbar>
      <Card className="import-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div
          className={`drag-drop-area ${importedFile ? 'file-selected' : ''}`}
          onDragOver={(event) => event.preventDefault()}
        >
          <label htmlFor="fileInput">
            <div className="drag-drop-content">
              <p>click here to select a file</p>
            </div>
            <input type="file" id="fileInput" accept=".xlsx, .xls" onChange={handleFileSelect} />
          </label>
        </div>

        {isLoading ? (
          <div className="flex justify-start">
            <CircularProgress /> Importing...
          </div>
        ) : null}

        <div>
          <Button
            style={{
              backgroundColor: 'red',
              marginLeft: '40px',
              marginRight: '30px',
              borderRadius: '20px',
              color: 'white',
            }}
            onClick={handleCancelImport}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: 'black', marginRight: '30px', borderRadius: '20px' }}
            className="whitespace-nowrap mr-20 mt-20"
            variant="contained"
            color="primary"
            onClick={handleStartImport}
          >
            Start Import
          </Button>
          <Button
            variant="contained"
            onClick={handleDownloadTemplate}
            style={{ backgroundColor: 'black', borderRadius: '20px' }}
          >
            Download Template
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ImportPage;
