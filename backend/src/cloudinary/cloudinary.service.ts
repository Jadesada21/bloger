import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import 'multer'


@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                { folder: 'blog' },
                (error, result) => {
                    if (error || !result) return reject(error)
                    resolve({ url: result.secure_url, publicId: result.public_id })
                },
            )
            Readable.from(file.buffer).pipe(upload)
        })
    }

    async deleteImage(publicId: string) {
        return cloudinary.uploader.destroy(publicId)
    }
}