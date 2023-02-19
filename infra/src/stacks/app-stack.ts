import { Stack, App, StackProps } from 'aws-cdk-lib';
import * as awsEc2 from 'aws-cdk-lib/aws-ec2';

export class AppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // defines your stack here
    const vpc = new awsEc2.Vpc(this, 'Vpc');
  }
}
