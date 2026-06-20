import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title!: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    summary!: string

    @IsString()
    @IsNotEmpty()
    content!: string

    @IsString()
    @IsOptional()
    @MaxLength(300)
    coverImage?: string
}
