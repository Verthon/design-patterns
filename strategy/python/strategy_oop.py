from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Literal, Union, Awaitable, TypedDict, Callable, Dict, Optional

NotificationProvider = Union[
    Literal["email"], Literal["sms"], Literal["push_notification"]
]
Message = str
AsyncTask = Awaitable[Literal["success", "failure"]]


class NotificationStrategy(ABC):
    @abstractmethod
    def notify(self, message: Message) -> AsyncTask:
        pass


class SendEmailParams(TypedDict):
    email_address: str
    subject: str
    message: Message


SendEmailMethod = Callable[[SendEmailParams], AsyncTask]


class EmailNotificationStrategyParams(TypedDict):
    user_email: str
    subject: str
    send_email: SendEmailMethod


class EmailNotificationStrategy(NotificationStrategy):
    def __init__(self, params: EmailNotificationStrategyParams) -> None:
        self.user_email = params["user_email"]
        self.subject = params["subject"]
        self.send_email = params["send_email"]

    async def notify(self, message: str):
        email_params: SendEmailParams = {
            "email_address": self.user_email,
            "subject": self.subject,
            "message": message,
        }
        return await self.send_email(email_params)


NotificationStrategies = Dict[NotificationProvider, Optional[NotificationStrategy]]


@dataclass
class NotifyParams:
    provider: NotificationProvider
    message: Message


class Notifier:
    def __init__(self, strategies: NotificationStrategies) -> None:
        self.strategies = strategies

    async def notify(self, params: NotifyParams):
        strategy = self.strategies[params.provider]

        if not (strategy):
            raise Exception("Notification strategy for ${provider} is not provided.")

        return await strategy.notify(params.message)
