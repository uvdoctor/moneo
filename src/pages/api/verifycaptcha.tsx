import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    method,
    body: { token },
  } = req;
  if (method === "POST") {
    const secret = "6LdTyd8ZAAAAAEB3B2-P2swyDqrqpBQEcY4m0sOf";
    fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secret}&response=${token}`,
    })
      .then((captchaResponse) => captchaResponse.json())
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        if (!response || !response.score || !response.success) {
          res.status(500).end("Google captcha failed");
        }
        if (response.score < 0.5) {
          res.status(403).json({ success: false });
        } else {
          res.status(200).json({ success: true });
        }
      })
      .catch((e) => {
        console.log("Error while invoking google captcha: ", e);
        res.status(500).end("Google captcha error");
      });
  } else {
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
