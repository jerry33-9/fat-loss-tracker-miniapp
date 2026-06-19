/**
 * HTTP API 封装
 * 开发时指向本地，上线改为你服务器的域名
 */

const BASE_URL = 'http://localhost:8080/api'

interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

function request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, data?: any): Promise<T> {
  const openid = getApp<IAppOption>().globalData.openid || ''
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'X-Openid': openid
      },
      success(res) {
        const body = res.data as ApiResponse<T>
        if (body.code === 0) {
          resolve(body.data)
        } else {
          reject(new Error(body.message || '请求失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export function get<T>(path: string) { return request<T>('GET', path) }
export function post<T>(path: string, data?: any) { return request<T>('POST', path, data) }
export function put<T>(path: string, data?: any) { return request<T>('PUT', path, data) }
export function del<T>(path: string) { return request<T>('DELETE', path) }

/** 微信登录 */
export function login(): Promise<string> {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: BASE_URL + '/login',
            method: 'POST',
            data: { code: res.code },
            success(loginRes) {
              const body = loginRes.data as ApiResponse<{ token: string; openid: string }>
              if (body.code === 0 && body.data) {
                getApp<IAppOption>().globalData.openid = body.data.openid
                resolve(body.data.openid)
              } else {
                reject(new Error('登录失败'))
              }
            },
            fail: reject
          })
        } else {
          reject(new Error('wx.login 失败'))
        }
      },
      fail: reject
    })
  })
}

/** 上传文件 */
export function uploadFile(filePath: string): Promise<string> {
  const openid = getApp<IAppOption>().globalData.openid || ''
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: BASE_URL + '/upload',
      filePath,
      name: 'file',
      header: { 'X-Openid': openid },
      success(res) {
        const body = JSON.parse(res.data) as ApiResponse<{ url: string }>
        if (body.code === 0 && body.data) {
          resolve(BASE_URL.replace('/api', '') + body.data.url)
        } else {
          reject(new Error(body.message || '上传失败'))
        }
      },
      fail: reject
    })
  })
}

// ---- 体重 API ----

export async function getWeights(params?: { limit?: number }) {
  const qs = params ? '?' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') : ''
  return get<WeightRecord[]>('/weights' + qs)
}

export function addWeight(data: { weight: number; date: string; note?: string }) {
  return post<WeightRecord>('/weights', data)
}

// ---- 饮食 API ----

export async function getDiets(params?: { date?: string }) {
  const qs = params?.date ? `?date=${params.date}` : ''
  return get<DietRecord[]>('/diets' + qs)
}

export function addDiet(data: {
  mealType: string
  date: string
  foods: { name: string; amount: string; calories: number }[]
  totalCalories: number
  photoUrls: string[]
  note?: string
}) {
  return post<DietRecord>('/diets', data)
}

// ---- 训练 API ----

export async function getWorkouts(params?: { startDate?: string; endDate?: string }) {
  const qs = params ? '?' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') : ''
  return get<WorkoutRecord[]>('/workouts' + qs)
}

export function addWorkout(data: {
  date: string
  exercises: WorkoutExercise[]
  duration: number
  calories: number
  note?: string
}) {
  return post<WorkoutRecord>('/workouts', data)
}

// ---- 目标 API ----

export function getGoal() {
  return get<UserGoal | null>('/goal')
}

export function setGoal(data: {
  targetWeight: number
  startWeight: number
  weeklyTarget: number
}) {
  return post<UserGoal>('/goal', data)
}

export function deleteGoal() {
  return del<void>('/goal')
}

// ---- 统计 API ----

export function getStats() {
  return get<{
    totalWeights: number
    totalDiets: number
    totalExercises: number
    streakDays: number
  }>('/stats')
}
