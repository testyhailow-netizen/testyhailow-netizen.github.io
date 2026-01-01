exports.handler = async () => {
  try {
    const rssUrl = "https://www.etsy.com/shop/VirtualUtopiaDesignz/rss";

    const res = await fetch(rssUrl, {
      headers: {
        // helps avoid some "blocked by bot protection" situations
        "User-Agent": "Mozilla/5.0 (Netlify Function)",
        "Accept": "application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Failed to fetch RSS (${res.status})` }),
      };
    }

    const xml = await res.text();

    // Super simple RSS parsing (good enough for Etsy RSS)
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 12);

    const parseTag = (block, tag) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? m[1].trim() : "";
    };

    const stripCdata = (s) => s.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();

    const products = items.map((match) => {
      const block = match[1];

      const title = stripCdata(parseTag(block, "title"));
      const link = stripCdata(parseTag(block, "link"));
      const pubDate = stripCdata(parseTag(block, "pubDate"));
      const description = stripCdata(parseTag(block, "description"));

      // try to pull an image from description (often contains <img src="...">)
      const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
      const image = imgMatch ? imgMatch[1] : "";

      return {
        title,
        link,
        pubDate,
        image,
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify({ products }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
