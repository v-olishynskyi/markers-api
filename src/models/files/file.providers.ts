import { PUBLIC_FILE_REPOSITORY } from 'src/common/constants';
import { PublicFile } from 'src/models/files/entities/file.entity';

export const publicFileProviders = [
  {
    provide: PUBLIC_FILE_REPOSITORY,
    useValue: PublicFile,
  },
];
