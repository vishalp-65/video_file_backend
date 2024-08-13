import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

// Mock S3
AWSMock.setSDKInstance(AWS);
AWSMock.mock("S3", "putObject", (params: any, callback: any) => {
    callback(null, { ETag: "mock-etag" });
});
