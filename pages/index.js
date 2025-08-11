import { useState } from 'react'
import useSWR from 'swr'
const fetcher = (url) => fetch(url).then(r => r.json())

export default function Home(){
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const { data } = useSWR('/api/list', fetcher)

  async function handleSubmit(e){
    e.preventDefault()
    setResult(null)
    const res = await fetch('/api/shorten', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ url })
    })
    const data = await res.json()
    if(res.ok){
      setResult({ short: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/${data.short_code}` })
      setUrl('')
    } else {
      alert(data.error || 'Error creating short URL')
    }
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <p className="small">Paste a long URL and get a short link.</p>
      <form onSubmit={handleSubmit}>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.example.com/very/long/path" required />
        <button type="submit">Shorten</button>
      </form>

      {result && (
        <div style={{ marginTop:16 }}>
          <p>Short URL:</p>
          <a href={result.short} target="_blank" rel="noreferrer">{result.short}</a>
        </div>
      )}

      <h3 style={{ marginTop:24 }}>Recent</h3>
      <div>
        {data && data.urls.length === 0 && <p className="small">No URLs yet.</p>}
        {data && data.urls.length > 0 && (
          <ul>
            {data.urls.map(u => (
              <li key={u._id} style={{ marginTop:8 }}>
                <a href={`${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/${u.short_code}`} target="_blank" rel="noreferrer">{u.short_code}</a>
                {' '}→ <a href={u.original_url} target="_blank" rel="noreferrer" className="small">{u.original_url}</a>
                <span className="small"> ({u.visits} visits)</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
