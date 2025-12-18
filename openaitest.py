from openai import OpenAI

client = OpenAI(
  api_key="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"
)

response = client.responses.create(
  model="gpt-5-nano",
  input="write a haiku about ai",
  store=True,
)

print(response.output_text);
