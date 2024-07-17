export default async function handler(req, res) {
  if (req.method === "POST") {
    const response = await fetch("http://localhost:5000/api/ai", {
      method: "POST",
      body: req.body,
      headers: {
        ...req.headers,
        host: "localhost:5000",
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } else {
    res.status(405).end();
  }
}
