import dbConnect from '../lib/mongodb'
import Url from '../models/Url'

export async function getServerSideProps({ params }){
  await dbConnect();
  const doc = await Url.findOne({ short_code: params.shortcode });
  if(!doc){
    return { notFound: true };
  }
  await Url.updateOne({ _id: doc._id }, { $inc: { visits: 1 } });
  return {
    redirect: {
      destination: doc.original_url,
      permanent: false
    }
  }
}

export default function RedirectPage(){ return null }
