import useSWR from 'swr'
const fetcher = (url) => fetch(url).then(r=>r.json())

export default function Admin(){
  const { data } = useSWR('/api/list', fetcher)
  return (
    <div className="container">
      <h1>Admin - All URLs</h1>
      {!data && <p>Loading...</p>}
      {data && data.urls.length === 0 && <p>No URLs yet.</p>}
      {data && data.urls.length > 0 && (
        <table className="table">
          <thead><tr><th>Short</th><th>Original</th><th>Visits</th><th>Created</th></tr></thead>
          <tbody>
            {data.urls.map(u => (
              <tr key={u._id}>
                <td><a href={`/${u.short_code}`} target="_blank" rel="noreferrer">{u.short_code}</a></td>
                <td style={{maxWidth:400}}><a href={u.original_url} target="_blank" rel="noreferrer">{u.original_url}</a></td>
                <td>{u.visits}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
