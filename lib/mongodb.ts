import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

function generateLinks(title: string) {
      const shoppingPlatforms = [
        { name: 'Musinsa', url: 'https://www.musinsa.com/search/musinsa/goods?q=' },
        { name: '29CM', url: 'https://www.29cm.co.kr/search?keyword=' },
        { name: 'W Concept', url: 'https://www.wconcept.co.kr/Search?keyword=' },
        { name: 'SSENSE', url: 'https://www.ssense.com/en-us/search?q=' },
      ];
      const youtube = {
        name: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=',
      };
    
      const shoppingLinks = shoppingPlatforms.map(p => ({
        title: `${title} on ${p.name}`,
        url: `${p.url}${encodeURIComponent(title)}`,
        platform: p.name,
        type: 'shopping',
      }));
    
      const youtubeLink = {
        title: `${title} 관련 유튜브 영상`,
        url: `${youtube.url}${encodeURIComponent(title + ' 패션')}`,
        platform: youtube.name,
        type: 'youtube',
      };
    
      return [...shoppingLinks, youtubeLink];
    }