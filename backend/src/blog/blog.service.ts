import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdatePublishedDto } from './dto/published-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Injectable()
@UseGuards(JwtAuthGuard)
export class BlogService {
  constructor(private prisma: PrismaService) { }

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

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug
    let counter = 1

    while (await this.prisma.blog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    return slug
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
}
