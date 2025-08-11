import dbConnect from '../../lib/mongodb'
import Url from '../../models/Url'

export default async function handler(req, res){
  await dbConnect();
  const urls = await Url.find({}).sort({ createdAt: -1 }).limit(20).lean();
  res.status(200).json({ urls });
}
