type NotificationProvider = "email" | "sms" | "pushNotification";
type Message = string;
type AsyncTask = Promise<"success" | "failure">;
type NotificationStrategy = {
	notify: (message: Message) => AsyncTask;
};

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

export const createEmailNotificationStrategy = ({
	sendEmail,
	subject,
	userEmail,
}: EmailNotificationStrategyParams): NotificationStrategy => {
	const notify = async (message: Message) => {
		const state = await sendEmail({
			emailAddress: userEmail,
			subject: subject,
			message: message,
		});

		return state;
	};

	return { notify };
};

type SMSNotificationStrategyParams = {
	phoneNumber: string;
	sendSms: SendSMSMethod;
};
type SendSmsParams = { phoneNumber: string; message: Message };
type SendSMSMethod = ({ message, phoneNumber }: SendSmsParams) => AsyncTask;

export const createSMSNotificationStrategy = ({
	phoneNumber,
	sendSms,
}: SMSNotificationStrategyParams): NotificationStrategy => {
	const notify = async (message: Message) => {
		const state = await sendSms({
			phoneNumber: phoneNumber,
			message,
		});

		return state;
	};

	return { notify };
};

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

export const createPushNotificationStrategy = ({
	sendPushNotification,
	userId,
}: PushNotificationStrategyParams): NotificationStrategy => {
	const notify = async (message: Message) => {
		const state = await sendPushNotification({
			userId: userId,
			message,
		});

		return state;
	};

	return { notify };
};

type NotifierParams = {
	strategies: NotificationStrategies;
};

export const createNotifier = ({ strategies }: NotifierParams) => {
	const notify = async ({
		provider,
		message,
	}: {
		provider: NotificationProvider;
		message: Message;
	}) => {
		const strategy = strategies[provider];

		if (!strategy) {
			throw new Error(`Notification strategy for ${provider} is not provided.`);
		}

		return await strategy.notify(message);
	};

	return { notify };
};
