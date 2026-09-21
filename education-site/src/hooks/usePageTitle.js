import { useEffect } from 'react'

const SITE = 'Serenest Education'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} | Learning for mind & practice`
  }, [title])
}
