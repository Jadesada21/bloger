import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateSlugDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    slug!: string
}   