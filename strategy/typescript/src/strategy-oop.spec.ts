import { describe, it } from "node:test";

import {
	Notifier,
	EmailNotificationStrategy,
	SMSNotificationStrategy,
	PushNotificationStrategy,
} from "./strategy-oop.js";
import assert from "node:assert";

describe("oop version of strategy pattern", () => {
	it("should notify users via email", async () => {
		const emailStrategy = new EmailNotificationStrategy({
			userEmail: "example@test.com",
			subject: "Important information",
			sendEmail: async ({}) => "success",
		});
		const notifier = new Notifier({
			strategies: { email: { notify: emailStrategy.notify } },
		});

		const result = await notifier.notify({
			provider: "email",
			message: "Notification body",
		});

		assert.equal(result, "success");
	});

	it("should notify users via sms", async () => {
		const smsStrategy = new SMSNotificationStrategy({
			phoneNumber: "+00500500500",
			sendSms: async ({}) => "success",
		});
		const notifier = new Notifier({
			strategies: { sms: { notify: smsStrategy.notify } },
		});

		const result = await notifier.notify({
			provider: "sms",
			message: "Notification content",
		});

		assert.equal(result, "success");
	});

	it("should notify user directly in app via pushNotification", async () => {
		const pushNotificationStrategy = new PushNotificationStrategy({
			userId: "1a",
			sendPushNotification: async ({}) => "success",
		});
		const notifier = new Notifier({
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
