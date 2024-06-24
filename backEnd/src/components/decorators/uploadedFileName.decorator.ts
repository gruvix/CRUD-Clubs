import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const UploadedFileName = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const uploadedFile = request.file as Express.Multer.File;

    if (!uploadedFile) {
      console.log('Image file is required');
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }

    return uploadedFile.filename;
  },
);
