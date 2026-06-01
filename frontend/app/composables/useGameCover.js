import { gameService } from '~/services/gameService'

const coverCache = new Map()
const pendingRequests = new Map()

export function useGameCover() {
  async function getCover(gameName) {
    if (!gameName) return null

    if (coverCache.has(gameName)) {
      return coverCache.get(gameName)
    }

    if (pendingRequests.has(gameName)) {
      return pendingRequests.get(gameName)
    }

    const promise = gameService.getCover(gameName).then(url => {
      coverCache.set(gameName, url)
      pendingRequests.delete(gameName)
      return url
    }).catch(() => {
      coverCache.set(gameName, null)
      pendingRequests.delete(gameName)
      return null
    })

    pendingRequests.set(gameName, promise)
    return promise
  }

  return { getCover }
}
