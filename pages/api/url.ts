import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "urls";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;

    const db = client.db("urlshortener");
    let urls = await db.collection(COLLECTION_NAME);
    switch (req.method) {
      case "POST":
         const alreadyExist = await urls.findOne({
           targetUrl: req.body.targetUrl,
         });
        if (alreadyExist) {
           return res.status(201).json({ success: true, id: alreadyExist._id });
        }
        const newUrl = await urls.insertOne(req.body);
        res.status(201).json({ success: true, id: newUrl.insertedId });
        break;
      case "PATCH":
        const reqId = new ObjectId(req.body.id);
          const reqIp = req.body.ip?.replaceAll('.','-');
        const url = await urls.findOne({ _id: reqId });
        if (!url)
          return res
            .status(404)
            .json({ success: false, message: "URL not found!" });
        const updatedUrl = await urls.findOneAndUpdate(
          { _id: reqId },
          {
            $set: {
              totalVisits: (url.totalVisits || 0) + 1,
              [reqIp]: (url[reqIp] || 0) + 1,
              // interactions: true,
            },
          },
          { upsert: true }
        );
        res.status(201).json({ success: true, url: updatedUrl });
        break;

      case "GET":
        const id = req.query.id as string;
        let allUrl;
        if (id) {
          allUrl = await urls.findOne({ _id: new ObjectId(id) });
        } else {
          allUrl = await urls.find({}).toArray();
        }
        res.status(200).json({ success: true, [id ? "url" : "urls"]: allUrl });
        break;
    }
  } catch (e) {
    res.status(400).json({ success: false, message: (e as Error).message });
  }
}
