import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

class MessageResponse {
  @ApiProperty({ name: 'message', type: String })
  message: string;
}

export const ApiMessageResponse = () =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(MessageResponse) },
          {
            properties: {
              message: {
                type: 'string',
              },
            },
          },
        ],
      },
    }),
  );
