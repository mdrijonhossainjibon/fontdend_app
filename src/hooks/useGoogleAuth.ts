import { useDispatch, useSelector } from 'react-redux'
import { useGoogleLogin } from '@react-oauth/google'
import { googleLoginRequest } from '@/modules/auth/actions'
import type { RootState } from '@/modules/rootReducer'

export function useGoogleAuth() {
  const dispatch = useDispatch()
  const loading = useSelector((state: RootState) => state.auth.loading)

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: (tokenResponse) => {
      dispatch(googleLoginRequest({ access_token: tokenResponse.access_token }))
    },
    onError: () => {
      // Handled in saga via notification
    },
  })

  return { login, loading }
}
