exports.handler = async () => {
  const apiKey = process.env.ETSY_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing ETSY_API_KEY" }),
    };
  }

  const res = await fetch(
    "https://openapi.etsy.com/v3/application/shops?shop_name=VirtualUtopiaDesignz",
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  const data = await res.json();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};
