import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdatePublishedDto } from './dto/published-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify'
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateSlugDto } from './dto/update-slug-blog.dto';


@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService
  ) { }

  async create(createBlogDto: CreateBlogDto) {
    const baseSlug = slugify(createBlogDto.title, { lower: true, strict: true })

    const slug = await this.generateUniqueSlug(baseSlug)

    return this.prisma.blog.create({
      data: {
        ...createBlogDto,
        slug,
      },
    })
  }


  async findAll(page: number = 1) {
    const take = 10
    const skip = (page - 1) * take

    const [data, total] = await Promise.all([
      this.prisma.blog.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blog.count({
        where: { deletedAt: null }
      })
    ])
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({ where: { id } })

    if (!blog) { throw new NotFoundException(`Blog id ${id} not found`) }
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    await this.findOne(id)

    return this.prisma.blog.update({
      where: { id },
      data: { ...updateBlogDto },
    })
  }

  async updateCoverImage(id: number, file: Express.Multer.File) {
    const blog = await this.prisma.blog.findUnique({ where: { id } })
    if (!blog) { throw new NotFoundException(`Blog id ${id} not found`) }

    if (blog.coverImagePublicId) {
      await this.cloudinaryService.deleteImage(blog.coverImagePublicId)
    }

    const { url, publicId } = await this.cloudinaryService.uploadImage(file)

    return this.prisma.blog.update({
      where: { id },
      data: { coverImage: url, coverImagePublicId: publicId }
    })
  }

  async updateSlug(id: number, updateSlugDto: UpdateSlugDto) {
    const blog = await this.findOne(id)

    const baseSlug = slugify(updateSlugDto.slug, { lower: true, strict: true })
    const newSlug = await this.generateUniqueSlug(baseSlug, id)

    return this.prisma.blog.update({
      where: { id },
      data: { slug: newSlug }
    })

  }

  async togglePublished(id: number, updatePublishedDto: UpdatePublishedDto) {
    return this.prisma.blog.update({
      where: { id },
      data: { isPublished: updatePublishedDto.isPublished }
    });
  }

  async softDelete(id: number) {
    return this.prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async restore(id: number) {
    return this.prisma.blog.update({
      where: { id },
      data: { deletedAt: null }
    })
  }

  private async generateUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {

    let slug = baseSlug
    let counter = 1

    while (true) {
      const existing = await this.prisma.blog.findUnique({ where: { slug } })
      if (!existing || existing.id === excludeId) break
      slug = `${baseSlug}-${counter}`
      counter++
    }
    return slug
  }
}
