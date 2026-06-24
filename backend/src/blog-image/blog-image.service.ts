import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BlogImageService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService
    ) { }



    async addImage(blogId: number, file: Express.Multer.File) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } })
        if (!blog) throw new NotFoundException(`Blog id ${blogId} not found`)

        const imageCount = await this.prisma.blog_image.count({ where: { id: blogId } })
        if (imageCount >= 6) {
            throw new BadRequestException(`Blog can have maximun 6 addtional images`)
        }

        const { url, publicId } = await this.cloudinary.uploadImage(file)

        return this.prisma.blog_image.create({
            data: { url, publicId, blogId }
        })
    }

    async removeImage(blogId: number, imageId: number) {
        const image = await this.prisma.blog_image.findUnique({ where: { id: blogId } })

        if (!image || image.blogId !== blogId) {
            throw new NotFoundException(`Image not found`)
        }

        await this.cloudinary.deleteImage(image.publicId)

        return this.prisma.blog_image.delete({ where: { id: imageId } })
    }
}
