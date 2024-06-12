import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@comp/guards/auth.guard';
import { TeamGuard } from '@comp/guards/team.guard';
import CrestService from '@comp/services/crest.service';
import multerOptions from '@comp/storage/multerConfig';
import { UserId } from '@comp/decorators/userId.decorator';
import { TeamId } from '@comp/decorators/teamId.decorator';
import { FileName } from '@comp/decorators/fileName.decorator';
import { UploadedFileName } from '@comp/decorators/uploadedFileName.decorator';
import FileNotFoundError from '@comp/errors/fileNotFoundError';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/customCrest')
export default class CrestController {
  constructor(private readonly crestService: CrestService) {}

  @Get(':teamId/:fileName')
  async getCrest(
    @UserId() userId: number,
    @TeamId() teamId: number,
    @FileName() fileName: string,
  ): Promise<StreamableFile> {
    try {
      console.log(`User ${userId} is requesting crest for team ${teamId}`);
      const fileBuffer = await this.crestService.getCrest(userId, fileName);
      return new StreamableFile(fileBuffer);
    } catch (error) {
      if (error instanceof FileNotFoundError)
        throw new HttpException('Crest not found', HttpStatus.NOT_FOUND);
      else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Failed to get crest',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':teamId')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateCrest(
    @UserId() userId: number,
    @TeamId() teamId: number,
    @UploadedFileName() imageFileName: string,
  ): Promise<string> {
    console.log(`User ${userId} is updating crest for team ${teamId}`);
    try {
      const newCrestUrl = await this.crestService.updateCrest(
        userId,
        teamId,
        imageFileName,
      );
      return JSON.stringify(newCrestUrl);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Failed to update crest',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
