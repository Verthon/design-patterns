import unittest

from strategy_oop import EmailNotificationStrategy, Notifier, NotifyParams


class TestNotifier(unittest.IsolatedAsyncioTestCase):
    async def test_email_notification(self):
        async def mock_send_email(params):
            return "success"

        email_strategy = EmailNotificationStrategy(
            params={
                "user_email": "example@test.com",
                "subject": "test subject",
                "send_email": mock_send_email,
            }
        )

        notifier = Notifier({"email": email_strategy})

        result = await notifier.notify(
            NotifyParams(provider="email", message="Notification body")
        )

        self.assertEqual(result, "success")


if __name__ == "__main__":
    unittest.main()
