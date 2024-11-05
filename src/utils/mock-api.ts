const MockApi = <T>({
  data,
  error,
  duration,
}: {
  data?: T
  error?: any
  duration?: number
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data) resolve(data)
      else if (error) reject(error)
      else reject({ code: 404 })
    }, duration || 300)
  })
}

export const simulateApiResponse = <T>(
  mockData: T,
  minDelay= 1000,
  maxDelay= 5000,
  failureRate = 0.2
): Promise<T> => {
  return new Promise((resolve, reject) => {
    // Simulate random delay
    const delay = Math.random() * (maxDelay - minDelay) + minDelay
    setTimeout(() => {
      // Simulate random failure
      if (Math.random() < failureRate) {
        reject(new Error('Simulated API failure'))
      } else {
        resolve(mockData)
      }
    }, delay)
  })
}

export default MockApi
