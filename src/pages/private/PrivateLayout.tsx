import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'

import styles from "../../styles/publicLayout.module.scss";

type Props = {
  children: ReactNode
}

const PrivateLayout = ({ children }: Props) => {
  const { loading, auth } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className={styles['loading-spinner']}></div>
  }

  if (!auth) {
    router.push("/login") // redireciona para a página de login caso o usuário não esteja autenticado
    return null
  }

  return <div>{children}</div> // renderiza as rotas privadas caso o usuário esteja autenticado
}

export default PrivateLayout
