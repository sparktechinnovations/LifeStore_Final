import React, { useState } from 'react';
import { Button, Card, CircularProgress } from '@mui/material';

function ImportPage(props) {
  const [importedFile, setImportedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelImport = () => {
    setImportedFile(null);
    setIsLoading(false);
  };

  const handleStartImport = () => {
    if (importedFile !== null) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setImportedFile(null);
      }, 2000);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setImportedFile(file);
  };

  const isCancelDisabled = !importedFile;

  return (
    <div >

      <Card className="import-card" style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
        <div
          className={`drag-drop-area ${importedFile ? 'file-selected' : ''}`}
          onDragOver={(event) => event.preventDefault()}
        >
          <label htmlFor="fileInput">
            <div className="drag-drop-content">
              <p>click here to select a file</p>
            </div>
            <input
              type="file"
              id="fileInput"
              accept=".xlsx, .xls"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {isLoading ? (
          <div className="flex justify-start">
            <CircularProgress /> Importing...
          </div>
        ) : null}

        <div >
          <Button
          style={{backgroundColor:"red",marginLeft:"40px",marginRight:"30px",borderRadius:"20px"}}
            disabled={isCancelDisabled}
            onClick={handleCancelImport}
          >
            Cancel
          </Button>
          <Button
          style={{backgroundColor:"black",borderRadius:"20px"}}
            className="whitespace-nowrap mr-20 mt-20"
            variant="contained"
            color="primary"
            onClick={handleStartImport}
          >
            Start Import
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ImportPage;
