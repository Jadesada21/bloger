import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateBlogDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    title?: string

    @IsString()
    @IsOptional()
    @MaxLength(300)
    summary?: string

    @IsString()
    @IsOptional()
    content?: string

    @IsString()
    @IsOptional()
    @MaxLength(300)
    coverImage?: string
}