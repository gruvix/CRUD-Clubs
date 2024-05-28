import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    createParamDecorator,
  } from '@nestjs/common';
  
  export const FileName = createParamDecorator(
    (data: unknown, context: ExecutionContext): number => {
      const request = context.switchToHttp().getRequest();
      const fileName = request.params.fileName;
  
      if (!fileName) {
        console.log('Image file name is required');
        throw new HttpException('Image file name is required', HttpStatus.BAD_REQUEST);
      }
      return fileName;
    },
  );
  