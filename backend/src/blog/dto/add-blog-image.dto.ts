import { IsNotEmpty, IsString } from "class-validator";

export class AddBlogImageDto {
    @IsString()
    @IsNotEmpty()
    imageUrl!: string
}