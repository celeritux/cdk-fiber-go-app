import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export class CdkFiberGoAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      cidr: '10.37.0.0/16'
    })

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
        cpu: 256,
        memoryLimitMiB: 512,
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX
        }
    });

    taskDefinition.addContainer("WebContainer", {
      image: ecs.ContainerImage.fromAsset('app'),
      portMappings: [{
        containerPort: 8080,
        protocol: ecs.Protocol.TCP
      }]
    })

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'EcsService', {
      vpc: vpc,
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      taskDefinition: taskDefinition,
      desiredCount: 1
    })

    /*new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'EcsService', {
      vpc: vpc,
      cpu: 256,
      memoryLimitMiB: 512,
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('app'),
        containerPort: 8080,
      },
      desiredCount: 10
    })*/
  }
}
