/**
 * HTTP API 封装
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
      fail(err) { reject(err) }
    })
  })
}

export function get<T>(path: string) { return request<T>('GET', path) }
export function post<T>(path: string, data?: any) { return request<T>('POST', path, data) }

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

// ---- 训练 API ----

export async function getWorkouts() {
  return get<WorkoutRecord[]>('/workouts')
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
