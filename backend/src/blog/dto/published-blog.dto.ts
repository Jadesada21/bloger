import { IsBoolean, IsNotEmpty } from "class-validator";


export class UpdatePublishedDto {
    @IsBoolean()
    @IsNotEmpty()
    isPublished!: boolean
}
