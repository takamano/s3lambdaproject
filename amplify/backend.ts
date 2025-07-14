import { defineBackend } from '@aws-amplify/backend';
import { imageStorage } from './storage/resource';
import { generateThumb } from './functions/resize/resource';
import { Backend } from 'aws-cdk-lib/aws-appmesh';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { auth } from './auth/resource';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend  ({
  imageStorage,
  generateThumb,
  auth
});

backend.imageStorage.resources.bucket.addEventNotification(
  EventType.OBJECT_CREATED_PUT,
  new LambdaDestination(backend.generateThumb.resources.lambda),
  {prefix: 'originals/'}
)
