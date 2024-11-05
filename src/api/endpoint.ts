import Request from '@/utils/request'

// Edit the suffix base on the version of your server API
const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1`

// Instance that using to access server APIs
const MainApi = Request.create({
  endpoint,
  handleToken: true,
  camelcaseKeys: true
})

const NoCamelcaseApi = Request.create({
  endpoint,
  handleToken: true,
  camelcaseKeys: false
})

// Instance that using to access external APIs
const ExternalApi = Request.create({
  endpoint: ''
})

export { MainApi, ExternalApi, NoCamelcaseApi }
