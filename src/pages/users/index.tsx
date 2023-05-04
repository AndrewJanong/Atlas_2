import Layout from '~/components/common/Layout'
import Head from 'next/head'
import DataTable from '~/components/users/Table'
import TopNavbar from '~/components/common/TopNavbar'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'

export default function AdminUserPage() {
  const { status, data: session } = useSession({ required: true })
  const router = useRouter()

  if (status === 'loading') {
    return <LoadingScreen />
  } else if (!session.isAdmin) {
    router.push('/')
  } else {
    return (
      <>
        <Head>
          <title>Atlas | Users</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="The login page for Atlas" />
        </Head>
        <TopNavbar isAdmin={session.isAdmin} />
        <Layout>
          <DataTable />
        </Layout>
      </>
    )
  }
}
