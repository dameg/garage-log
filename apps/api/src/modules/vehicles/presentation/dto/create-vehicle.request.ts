import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

export class CreateVehicleRequest {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  brand!: string;

  @ApiProperty()
  @IsString()
  model!: string;

  @ApiProperty()
  @IsInt()
  @Min(1886)
  year!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  mileage!: number;
}
