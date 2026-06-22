import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile, UseGuards, Delete, BadRequestException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdatePublishedDto } from './dto/published-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from '../common/multer-config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateSlugDto } from './dto/update-slug-blog.dto';
import { v2 as cloudinary } from 'cloudinary'

@Controller('blog')
export class BlogController {
  cloudinary: any;
  constructor(private readonly blogService: BlogService) { }

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  findAll(@Query('page') page?: string) {
    return this.blogService.findAll(page ? parseInt(page, 10) : 1);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto)
  }

  @Patch(':id/cover')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverImage', imageUploadOptions))
  updateCoverImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Cover image is required')
    }
    return this.blogService.updateCoverImage(+id, file)
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  togglePublished(@Param('id') id: string, @Body() updatePublishedDto: UpdatePublishedDto) {
    return this.blogService.togglePublished(+id, updatePublishedDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(@Param('id') id: string) {
    return this.blogService.softDelete(+id)
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  restore(@Param('id') id: string) {
    return this.blogService.restore(+id)
  }

  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  updateSlug(@Param('id') id: string, @Body() updateSlugDto: UpdateSlugDto) {
    return this.blogService.updateSlug(+id, updateSlugDto)
  }
}
