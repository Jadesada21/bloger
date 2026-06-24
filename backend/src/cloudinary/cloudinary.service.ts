import { Get, Inject, Injectable } from "@nestjs/common";
import { v2 as CloudinaryType } from 'cloudinary'
import 'multer'


@Injectable()
export class CloudinaryService {
    constructor(
        @Inject('CLOUDINARY')
        private readonly cloudinary: typeof CloudinaryType,
    ) { }

    async uploadImage(
        file: Express.Multer.File
    ): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            const upload = this.cloudinary.uploader.upload_stream(
                {
                    folder: 'blog',
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (!result) {
                        reject(new Error('No result from Cloudinary'));
                        return;
                    }
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            )
            upload.end(file.buffer);
        })
    }

    async deleteImage(publicId: string) {
        return this.cloudinary.uploader.destroy(publicId)
    }

    async testUpload() {
        return this.cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            {
                folder: 'test'
            }
        )
    }
}