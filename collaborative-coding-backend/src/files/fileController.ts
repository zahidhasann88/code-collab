import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const baseDir = path.join(__dirname, '../../files'); // Adjust path as needed

export const listFiles = (req: Request, res: Response) => {
  fs.readdir(baseDir, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files');
    }
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
