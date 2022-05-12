import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useGoogleAPI } from '../hooks/useGoogleAPI'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest',
]

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
]

function useEffectOnce(effect: React.EffectCallback) {
  const [affected, setAffected] = useState(false)

  useEffect(() => {
    if (affected) return

    setAffected(true)

    return effect()
  }, [])
}

export const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const { setup, setToken, getToken, revokeToken } = useGoogleAPI({
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scopes: SCOPES,
  })

  useEffectOnce(() => {
    setup().then(async () => {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) return
      setIsSignedIn(await setToken(accessToken))
    })
  })

  const call = useCallback(async () => {
    const list = await gapi.client.drive.files.list({ q: `'root' in parents` })
    console.log(list)
  }, [])

  const checkCredential = useCallback(() => {
    console.log(gapi.client.getToken())
  }, [])

  const signIn = useCallback(async () => {
    const token = await getToken()

    localStorage.setItem('access_token', token.access_token)

    setIsSignedIn(true)
  }, [])

  const signOut = useCallback(async () => {
    await revokeToken()
    setIsSignedIn(false)
    localStorage.removeItem('access_token')
  }, [])

  const [searchable, setSearchable] = useState(true)
  const [search, setSearch] = useState('')
  const [files, setFiles] = useState<gapi.client.drive.File[]>([])

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [],
  )

  const onClickSearch = useCallback(async () => {
    setSearchable(false)

    const res = await gapi.client.drive.files.list({
      q: `mimeType contains 'image/' and trashed = false and ( fullText contains '${search}' or name contains '${search}' ) and ( '1cAm3mhIxRaAGAI6-4_Irw4wA5GlTR9kT' in parents or '1yTUz48VtVq1TWNtVWXZECaqdSkYi5r5m' in parents )`,
      fields:
        'files(id,kind,mimeType,name,thumbnailLink,webContentLink,parents)',
    })
    console.log(res.result.files)

    setFiles(res.result.files ?? [])

    setSearchable(true)
  }, [search])

  const onImageClick = useCallback(async (fileId: string, mimeType: string) => {
    const res = await gapi.client.drive.files.get({ fileId, alt: 'media' })

    const imagebin = new Uint8Array(
      Array.from(res.body).map((b) => b.charCodeAt(0)),
    )

    const image = new Blob([imagebin], { type: mimeType })

    const url = URL.createObjectURL(image)

    console.log(imagebin, image, url)

    const img = document.createElement('img')
    img.setAttribute('src', url)
    document.body.appendChild(img)
  }, [])

  return (
    <div>
      <div>
        <label>
          isSignedIn?
          <input type="checkbox" checked={isSignedIn} readOnly />
        </label>
        <button onClick={signIn} disabled={isSignedIn}>
          Authorize
        </button>
        <button onClick={signOut} disabled={!isSignedIn}>
          Sign Out
        </button>
        <button onClick={call} disabled={!isSignedIn}>
          Call API
        </button>
        <button onClick={checkCredential}>Check Credential</button>
      </div>
      <div>
        <input type="search" value={search} onChange={onSearchChange} />
        <button onClick={onClickSearch} disabled={!isSignedIn || !searchable}>
          Search
        </button>
      </div>
      <div>
        {files.map((f, i) => (
          <div key={i}>
            <p>
              {f.parents?.join('/')}/{f.id}: {f.name}
            </p>
            <a href={f.webContentLink}>
              <img src={f.thumbnailLink} />
            </a>
            <button onClick={() => onImageClick(f.id ?? '', f.mimeType ?? '')}>
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
