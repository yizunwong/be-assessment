import { useRouter } from "next/router"

const Index = () => {
  const router = useRouter()
  console.log(router)

  return(
    <h1>Hi {router.query.id}</h1>
  )
}

export default Index