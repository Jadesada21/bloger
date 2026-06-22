import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post('blog/:blogId')
    addComment(@Param('blogId') blogId: string, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.addComment(+blogId, createCommentDto)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateApproved(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.updateApproved(+id, updateCommentDto.isApproved)
    }
}
