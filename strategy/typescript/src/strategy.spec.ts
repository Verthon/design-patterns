import { describe, it } from "node:test";
import assert from "node:assert";
import {
	createEmailNotificationStrategy,
	createNotifier,
	createPushNotificationStrategy,
	createSMSNotificationStrategy,
} from "./strategy.js";

describe("strategy pattern", () => {
	it("should notify users via email", async () => {
		const emailStrategy = createEmailNotificationStrategy({
			userEmail: "example@test.com",
			subject: "Important information",
			sendEmail: async ({}) => "success",
		});
		const notifier = createNotifier({
			strategies: { email: { notify: emailStrategy.notify } },
		});

		const result = await notifier.notify({
			provider: "email",
			message: "Notification body",
		});

		assert.equal(result, "success");
	});

	it("should notify users via sms", async () => {
		const smsStrategy = createSMSNotificationStrategy({
			phoneNumber: "+00500500500",
			sendSms: async ({}) => "success",
		});
		const notifier = createNotifier({
			strategies: { sms: { notify: smsStrategy.notify } },
		});

		const result = await notifier.notify({
			provider: "sms",
			message: "Notification content",
		});

		assert.equal(result, "success");
	});

	it("should notify user directly in app via pushNotification", async () => {
		const pushNotificationStrategy = createPushNotificationStrategy({
			userId: "1a",
			sendPushNotification: async ({}) => "success",
		});
		const notifier = createNotifier({
			strategies: {
				pushNotification: { notify: pushNotificationStrategy.notify },
			},
		});

		const result = await notifier.notify({
			provider: "pushNotification",
			message: "Notification content",
		});

		assert.equal(result, "success");
	});
});
