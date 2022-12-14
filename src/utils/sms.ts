import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });

export async function sendSMS(to: string, message: string): Promise<void> {
    // Create publish parameters
    const params = {
        Message: message,
        PhoneNumber: to,
    };

    // Create promise and SNS service object
    const publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
        .publish(params)
        .promise();

    // Handle promise's fulfilled/rejected states
    await publishTextPromise
        .then(data =>
            console.log("MessageID is " + data.MessageId),
        )
        .catch(err =>
            console.error(err, err.stack),
        );
}
