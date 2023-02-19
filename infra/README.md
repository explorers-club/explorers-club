# Infra

This app was generated using `@ago-dev/nx-aws-cdk-v2`. See https://github.com/adrian-goe/nx-aws-cdk-v2/tree/main/packages/aws-cdk-v2.

## Usage

To use this package, you can use the following NX commands

```
nx deploy infra
nx destroy infra
nx bootstrap infra --profile=profile
# see how to use aws environments https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html#bootstrapping-howto-cli
nx bootstrap myApp aws://123456789012/us-east-1
```

See https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html for setting up CDK credentials.
