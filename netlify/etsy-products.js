exports.handler = async () => {
  try {
    const apiKey = process.env.ETSY_API_KEY;      // Etsy app keystring
    const shopId = process.env.ETSY_SHOP_ID;      // your numeric shop id
    const limit = 12;

    if (!apiKey || !shopId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing ETSY_API_KEY or ETSY_SHOP_ID env vars." }),
      };
    }

    // Active listings for shop
    const url = `https://openapi.etsy.com/v3/application/shops/${shopId}/listings/active?limit=${limit}`;

    const r = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await r.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
