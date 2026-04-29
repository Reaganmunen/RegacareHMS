import Africastalking from "africastalking";

const africastalking = Africastalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!, // sandbox
});

const sms = africastalking.SMS;

export async function sendSMS(to: string, message: string) {
  try {
    // Use type assertion to bypass TypeScript requirement
    const options: any = {
      to: [to],
      message,
    };
    
    const response = await sms.send(options);
    console.log("SMS Response:", response);
    return true;
  } catch (error) {
    console.error("SMS Error:", error);
    return false;
  }
}