import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

@Injectable()
export class UploadFileMiddleware implements NestMiddleware {
    private upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './public/images');
            },
            filename: (req, file, cb) => {
                cb(null, req.body.img || file.originalname); // Use original name if req.body.img is not provided
            },
        }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            const fileTypes = /jpeg|jpg|png|gif/;
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = fileTypes.test(file.mimetype);

            if (mimetype && extname) {
                cb(null, true); // Accept the file
            } else {
                cb(new Error('Only image files are allowed!')); // Reject the file
            }
        },
        limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    }).single('file'); // Expecting a single file with the field name 'file'

    use(req: Request, res: Response, next: NextFunction): void {
        this.upload(req, res, (err: any) => {
            if (err) {
                return res.status(400).send({ message: err.message });
            }
            next(); // Proceed if no error
        });
    }
}