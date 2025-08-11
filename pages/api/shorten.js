import dbConnect from '../../lib/mongodb'
import Url from '../../models/Url'
import { nanoid } from 'nanoid'

export default async function handler(req, res){
  await dbConnect();
  if(req.method === 'POST'){
    const { url } = req.body;
    if(!url) return res.status(400).json({ error: 'No URL provided' });

    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const existing = await Url.findOne({ original_url: url });
    if(existing){
      return res.status(200).json({ short_code: existing.short_code });
    }

    let code; let exists;
    do {
      code = nanoid(7);
      exists = await Url.findOne({ short_code: code });
    } while (exists);

    const doc = await Url.create({ original_url: url, short_code: code });
    return res.status(201).json({ short_code: doc.short_code });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
