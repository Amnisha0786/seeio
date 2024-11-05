import Request from '@/utils/request'

// Edit the suffix base on the version of your server API
// const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1`
const endpoint = 'https://cg604iclak.execute-api.eu-west-1.amazonaws.com/v1';

// Instance that using to access server APIs
const AiApi = Request.create({
  endpoint,
  handleToken: true,
  camelcaseKeys: true
})

// Instance that using to access external APIs
const ExternalApi = Request.create({
  endpoint: ''
})

export { AiApi, ExternalApi }
