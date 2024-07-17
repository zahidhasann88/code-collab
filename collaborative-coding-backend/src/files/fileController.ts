import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const baseDir = path.join(__dirname, '../../files'); // Adjust path as needed

export const listFiles = (req: Request, res: Response) => {
    console.log('Attempting to read directory:', baseDir);
    fs.readdir(baseDir, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).send('Unable to scan files');
      }
      console.log('Files found:', files);
      res.send(files);
    });
  };

export const createFile = (req: Request, res: Response) => {
  const { filename } = req.body;
  fs.writeFile(path.join(baseDir, filename), '', (err) => {
    if (err) {
      return res.status(500).send('Unable to create file');
    }
    res.send('File created successfully');
  });
};

export const deleteFile = (req: Request, res: Response) => {
  const { filename } = req.body;
  fs.unlink(path.join(baseDir, filename), (err) => {
    if (err) {
      return res.status(500).send('Unable to delete file');
    }
    res.send('File deleted successfully');
  });
};

export const saveFile = (req: Request, res: Response) => {
    const { filename, content } = req.body;
    fs.writeFile(path.join(baseDir, filename), content, (err) => {
      if (err) {
        return res.status(500).send('Unable to save file');
      }
      res.send('File saved successfully');
    });
  };

  export const getFileContent = (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(baseDir, filename);
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(404).send('File not found');
      }
      res.json({ content: data });
    });
  };