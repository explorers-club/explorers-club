// ref https://github.com/forkfork/cdk-redisdb/blob/931abd1407f5b6e30c5141c6ada6b2567e632446/src/index.ts
import { Stack, App, StackProps } from 'aws-cdk-lib';
import { aws_memorydb as memorydb, aws_ec2 as ec2 } from 'aws-cdk-lib';

const RESOURCES = {
  MemoryDBLogicalID: 'MemoryDBLogicalID',
  MemoryDBACLLogicalID: 'MemoryDBACLLogicalID',
  MemoryDBACLName: 'MemoryDBACLName',
} as const;

export class AppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const VPC_ID = `${id}_VPC`;

    // defines your stack here
    // const vpc = new ec2.Vpc(this, 'Vpc');
    const vpc = new ec2.Vpc(this, VPC_ID, {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public Subnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Isolated Subnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    const isolatedSubnets = vpc.isolatedSubnets.map(function (value) {
      return value.subnetId;
    });

    const ecSecurityGroup = new ec2.SecurityGroup(this, id + '-RedisDB-SG', {
      vpc,
      description: 'SecurityGroup associated with RedisDB Cluster ' + id,
      allowAllOutbound: false,
    });

    const ecSubnetGroup = new memorydb.CfnSubnetGroup(
      this,
      id + '-RedisDB-SubnetGroup',
      {
        description: 'RedisDB Subnet Group',
        subnetIds: isolatedSubnets,
        subnetGroupName: 'memorydbsubnetgroup',
      }
    );

    const cluster = new memorydb.CfnCluster(this, 'memorydb', {
      aclName: 'open-access',
      clusterName: 'clustername',
      nodeType: 'db.t4g.small',

      autoMinorVersionUpgrade: false,
      description: 'description',
      // engineVersion: props.engineVersion ?? '6.2',
      // numShards: props.nodes || 1,
      // numReplicasPerShard: props.replicas || 0,
      securityGroupIds: [ecSecurityGroup.securityGroupId],
      subnetGroupName: ecSubnetGroup.subnetGroupName,
      tlsEnabled: true,
    });
    cluster.node.addDependency(ecSubnetGroup);

    // const securityGroup = new ec2.SecurityGroup(this, SECURITY_GROUP_ID, {
    //   vpc,
    //   description: 'Security group used for redis + ??',
    //   allowAllOutbound: false,
    // });

    // const REDIS_SUBNET_GROUP_NAME = 'RedisDBSubnetGroup';
    // const redisSubnetGroup = new elasticache.CfnSubnetGroup(
    //   this,
    //   REDIS_SUBNET_GROUP_ID,
    //   {
    //     description: 'RedisDB Subnet Group',
    //     subnetIds: isolatedSubnets,
    //     cacheSubnetGroupName: REDIS_SUBNET_GROUP_NAME,
    //   }
    // );

    // const db = new memorydb.CfnCluster(this, RESOURCES.MemoryDBLogicalID, {
    //   clusterName: 'my-memory-db-cluster',
    //   aclName: RESOURCES.MemoryDBACLName,
    //   nodeType: 'db.t4g.small',
    //   securityGroupIds: [memoryDBGroup.securityGroupId],
    //   // clusterName: 'memorydbTest',
    //   // numShards: 2,
    //   // subnetGroupName: 'memorydb',
    // });

    // new memorydb.CfnACL(this, RESOURCES.MemoryDBACLLogicalID, {
    //   aclName: RESOURCES.MemoryDBACLName,
    // });

    // const memoryDBGroup = new ec2.SecurityGroup(this, 'MemoryDB', {
    //   vpc,
    // });

    // memorydb.CfnCluster(this, 'MyMemoryDB', {
    //   clusterName: 'myMemoryDBTest',
    //   numSharrds: 2,
    // });
  }
}

// export class MemoryDB extends Construct {
//   public readonly cluster : memorydb.CfnCluster;
//     this.cluster = memorydb_cluster;
//     //memorydb_cluster.node.addDependency(cfnACL);
//     //cfnACL.node.addDependency(cfnUser);
//   }
// }
