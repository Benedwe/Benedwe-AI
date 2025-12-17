import os
import openai
from app.core import config

openai.api_key = config.settings.openai_api_key


def generate_completion(messages: list[dict], max_tokens: int = 512, temperature: float = 0.8) -> str:
    """Call the OpenAI chat completion API with a list of messages.

    messages: list of {role: 'system'|'user'|'assistant', 'content': str}
    """
    try:
        res = openai.ChatCompletion.create(
            model=config.settings.openai_model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        choice = res.choices[0]
        return choice.message.content.strip()
    except Exception as e:
        raise
