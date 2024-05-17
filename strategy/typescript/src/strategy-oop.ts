type NotificationProvider = "email" | "sms" | "pushNotification";
type Message = string;
type AsyncTask = Promise<"success" | "failure">;

interface NotificationStrategy {
	notify: (message: Message) => AsyncTask;
}

type NotificationStrategies = Partial<
	Record<NotificationProvider, NotificationStrategy>
>;

type SendEmailParams = {
	emailAddress: string;
	subject: string;
	message: Message;
};
type SendEmailMethod = (params: SendEmailParams) => AsyncTask;
type EmailNotificationStrategyParams = {
	userEmail: string;
	subject: string;
	sendEmail: SendEmailMethod;
};

export class EmailNotificationStrategy implements NotificationStrategy {
	private userEmail: string;
	private subject: string;
	private sendEmail: SendEmailMethod;
	constructor({
		userEmail,
		subject,
		sendEmail,
	}: EmailNotificationStrategyParams) {
		this.subject = subject;
		this.userEmail = userEmail;
		this.sendEmail = sendEmail;
	}

	public notify = async (message: Message) => {
		const state = await this.sendEmail({
			emailAddress: this.userEmail,
			subject: this.subject,
			message: message,
		});

		return state;
	};
}

type SMSNotificationStrategyParams = {
	phoneNumber: string;
	sendSms: SendSMSMethod;
};
type SendSmsParams = { phoneNumber: string; message: Message };
type SendSMSMethod = ({ message, phoneNumber }: SendSmsParams) => AsyncTask;

export class SMSNotificationStrategy implements NotificationStrategy {
	private phoneNumber: string;
	private sendSms: SendSMSMethod;
	constructor({ phoneNumber, sendSms }: SMSNotificationStrategyParams) {
		this.phoneNumber = phoneNumber;
		this.sendSms = sendSms;
	}

	public notify = async (message: Message) => {
		const state = await this.sendSms({
			phoneNumber: this.phoneNumber,
			message,
		});

		return state;
	};
}

type UserId = string;
type SendPushNotificationParams = {
	userId: UserId;
	message: Message;
};
type SendPushNotificationMethod = (
	params: SendPushNotificationParams
) => AsyncTask;
type PushNotificationStrategyParams = {
	userId: UserId;
	sendPushNotification: SendPushNotificationMethod;
};

export class PushNotificationStrategy implements NotificationStrategy {
	private userId: UserId;
	private sendPushNotification: SendPushNotificationMethod;
	constructor({
		userId,
		sendPushNotification,
	}: PushNotificationStrategyParams) {
		this.userId = userId;
		this.sendPushNotification = sendPushNotification;
	}

	public notify = async (message: Message) => {
		const state = await this.sendPushNotification({
			userId: this.userId,
			message,
		});

		return state;
	};
}

export class Notifier {
	private strategies: NotificationStrategies;
	constructor({ strategies }: { strategies: NotificationStrategies }) {
		this.strategies = strategies;
	}

	public notify = async ({
		provider,
		message,
	}: {
		provider: NotificationProvider;
		message: Message;
	}) => {
		const strategy = this.strategies[provider];

		if (!strategy) {
			throw new Error(`Notification strategy for ${provider} is not provided.`);
		}

		return await strategy.notify(message);
	};
}
